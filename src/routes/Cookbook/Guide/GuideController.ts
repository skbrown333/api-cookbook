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
      return await this.createAndUpdateCookbook(req, res, next);
    }

    const guides = await GuideModel.find({ cookbook, slug });

    if (guides.length) {
      return next(createError(500, 'Slug already exists'));
    }

    return await this.createAndUpdateCookbook(req, res, next);
  }

  async createAndUpdateCookbook(req, res, next) {
    const body = req.body;
    const { cookbook } = req.params;
    const params = {
      ...body,
      ...(cookbook ? { cookbook: cookbook } : {}),
    };

    let model = await this.model.create(params);
    const cookbooks = await CookbookModel.find({ _id: cookbook });

    if (cookbooks[0]) {
      cookbooks[0].guides?.push(model._id);
      await cookbooks[0].save();
    }

    if (this.populateFields) {
      model = await model.populate(this.populateFields).execPopulate();
    }

    return res.status(200).json(model);
  }

  async deleteAndUpdateCookbook(req, res, next) {
    const { cookbook, guide } = req.params;

    await this.model.findByIdAndDelete(guide);
    const cookbooks = await CookbookModel.find({ _id: cookbook });

    if (cookbooks[0]) {
      const cookbook = cookbooks[0];
      const guides = cookbook.guides;
      const index = guides?.findIndex((guideId) => guideId === guide);
      if (index && index > -1) {
        guides?.splice(index, 1);
        cookbooks[0].guides = guides;
        await cookbooks[0].save();
      }
    }

    return res.status(200).send();
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
