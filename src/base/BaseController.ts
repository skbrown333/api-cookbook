import createError from "http-errors";
export default class BaseController {
  model: any;
  populateFields: any;
  routeSingular: any;

  constructor(options) {
    if (!options || !options.model) throw new Error("Must Pass Options");

    this.model = options.model;
    this.populateFields = options.populateFields;
    this.routeSingular = options.routeSingular;
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req, res, next) {
    let body = req.body;
    const { cookbook } = req.params;
    let params = {
      ...body,
      ...(cookbook ? { cookbook: cookbook } : {}),
    };
    let model = await this.model.create(params);
    if (this.populateFields) {
      model = await model.populate(this.populateFields).execPopulate();
    }
    return res.status(200).json(model);
  }

  async get(req, res, next) {
    const { cookbook } = req.params;
    const query = req.query;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const filters = req.query.filters;
    const search = req.query.search;
    const contains = req.query.in;

    delete req.query.page;
    delete req.query.limit;
    delete req.query.filters;
    delete req.query.search;
    delete req.query.in;

    let sort;
    if (query.sort) {
      switch (query.sort) {
        case "cre_date":
          sort = { _id: -1 };
          break;
      }
      delete query.sort;
    }
    let params = {
      ...(cookbook && this.routeSingular !== "cookbook"
        ? { cookbook: cookbook }
        : {}),
      ...req.query,
      ...(filters && filters.length ? { tags: { $all: filters } } : {}),
      ...(search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { body: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
      ...(contains && contains.length ? { uid: { $in: contains } } : {}),
    };
    let models;
    if (this.populateFields) {
      models = await this.model
        .find(params)
        .populate(this.populateFields)
        .sort(sort)
        .skip(limit * (page - 1))
        .limit(limit)
        .exec();
    } else {
      models = await this.model.find({});
    }
    return res.status(200).send(models);
  }

  async getById(req, res, next) {
    if (!req.params || !req.params[this.routeSingular]) {
      return next(createError(500, "Missing required params"));
    }

    let modelId = req.params[this.routeSingular];
    let model = await this.model.findById(modelId);

    if (!model) {
      return res.status(500).json({ message: "Model not found", status: 500 });
    }

    if (this.populateFields) {
      model = await model.populate(this.populateFields).execPopulate();
    }

    return res.status(200).send(model);
  }

  async update(req, res, next) {
    let body = req.body;
    if (!req.params || !req.params[this.routeSingular]) {
      return next(createError(500, "Missing required params"));
    }

    let modelId = req.params[this.routeSingular];
    let model = await this.model.findById(modelId);

    if (!model) {
      return res.status(500).json({ message: "Model not found", status: 500 });
    }

    model = await this.model.findByIdAndUpdate(modelId, body, {
      new: true,
    });

    if (this.populateFields) {
      model = await model.populate(this.populateFields).execPopulate();
    }

    return res.status(200).json(model);
  }

  async delete(req, res, next) {
    if (!req.params || !req.params[this.routeSingular]) {
      return next(createError(500, "Missing required params"));
    }

    let modelId = req.params[this.routeSingular];
    await this.model.findByIdAndDelete(modelId);

    return res.status(200).send();
  }
}

module.exports = BaseController;
