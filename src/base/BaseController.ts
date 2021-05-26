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
      ...{ body },
      ...(cookbook ? { cookbook: cookbook } : {}),
    };
    try {
      let model = await this.model.create(params);
      if (this.populateFields) {
        model = await model.populate(this.populateFields).execPopulate();
      }
      return res.status(200).json(model);
    } catch (err) {
      throw err;
    }
  }

  async get(req, res, next) {
    try {
      let models;
      if (this.populateFields) {
        models = await this.model.find({}).populate(this.populateFields).exec();
      } else {
        models = await this.model.find({});
      }
      return res.status(200).send(models);
    } catch (err) {
      throw err;
    }
  }

  async getById(req, res, next) {
    try {
      if (!req.params || !req.params.id) {
        return res.status(400).send();
      }

      let modelId = req.params.id;
      let model = await this.model.findById(modelId);

      if (!model) {
        return res.status(404).send();
      }

      if (this.populateFields) {
        model = await model.populate(this.populateFields).execPopulate();
      }

      return res.status(200).send(model);
    } catch (err) {
      throw err;
    }
  }

  async update(req, res, next) {
    let body = req.body;
    try {
      if (!req.params || !req.params.id) {
        return res.status(400).send();
      }

      let modelId = req.params.id;
      let model = await this.model.findById(modelId);

      if (!model) {
        return res.status(404).send();
      }

      model = await this.model.findOneAndUpdate({ _id: modelId }, body, {
        new: true,
      });

      if (this.populateFields) {
        model = await model.populate(this.populateFields).execPopulate();
      }

      return res.status(200).json(model);
    } catch (err) {
      throw err;
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params || !req.params.id) {
        return res.status(400).send();
      }

      let modelId = req.params.id;
      let model = await this.model.findById(modelId);

      if (!model) {
        return res.status(404).send();
      }

      await this.model.deleteOne();

      return res.status(200).send();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BaseController;
