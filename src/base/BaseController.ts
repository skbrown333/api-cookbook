export default class BaseController {
  model: any;
  populateFields: any;

  constructor(options) {
    if (!options || !options.model) throw new Error("Must Pass Options");

    this.model = options.model;
    this.populateFields = options.populateFields;
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
  }

  async create(req, res, next) {
    let body = req.body;
    try {
      let model = await this.model.create(body);
      if (this.populateFields) {
        model = await model.populate(this.populateFields).execPopulate();
      }
      return res.status(200).json({ model });
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
        let error: any = new Error("Id Required");
        error.status = 400;
        throw error;
      }

      let modelId = req.params.id;
      let model = await this.model.findById(modelId);

      if (this.populateFields) {
        model = await model.populate(this.populateFields).execPopulate();
      }

      return res.status(200).send(model);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BaseController;
