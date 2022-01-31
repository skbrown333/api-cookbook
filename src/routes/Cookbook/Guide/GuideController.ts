import BaseController from '../../../base/BaseController';
import { GuideModel } from '../../../models/Guide/guide.model';
import createError from 'http-errors';
import { CookbookModel } from '../../../models/Cookbook/cookbook.model';

class GuideController extends BaseController {
  constructor() {
    const model = GuideModel;
    const options: any = {
      model,
    };
    options.populateFields = 'tags cookbook character';
    options.routeSingular = 'guide';
    super(options);
  }

  async create(req, res, next) {
    const { slug } = req.body;
    const { cookbook } = req.params;

    if (!slug) {
      return await super.create(req, res, next);
    }

    const guides = await GuideModel.find({ cookbook, slug });

    if (guides.length) {
      return next(createError(500, 'Slug already exists'));
    }

    const body = req.body;
    const params = {
      ...body,
      ...(cookbook ? { cookbook: cookbook } : {}),
    };
    let model = await this.model.create(params);

    if (this.populateFields) {
      model = await model.populate(this.populateFields).execPopulate();
    }

    const cookbooks = await CookbookModel.find({ _id: cookbook });
    console.log('cookbooks: ', cookbooks);
    if (cookbooks[0]) {
      cookbooks[0].guides = [...[cookbooks[0].guides], ...[model._id]];
      await cookbooks[0].save();
    }

    return res.status(200).json(model);
  }

  async update(req, res, next) {
    const { slug } = req.body;
    const { cookbook } = req.params;

    if (!slug) {
      return await super.update(req, res, next);
    }

    const guides = await GuideModel.find({ cookbook, slug });

    if (guides.length) {
      return next(createError(500, 'Slug already exists'));
    }

    return await super.update(req, res, next);
  }
}

export default new GuideController();
