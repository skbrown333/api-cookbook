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
      let model = await this.model
        .create(body)
        .populate(this.populateFields)
        .exec();
      return res.status(200).json({ model });
    } catch (err) {
      throw err;
    }
  }

  async get(req, res, next) {
    try {
      let models = await this.model
        .find({})
        .populate(this.populateFields)
        .exec();
      return res.status(200).send(models);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BaseController;
