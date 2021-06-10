import BaseController from '../../../base/BaseController';
import { GuideModel } from '../../../models/Guide/guide.model';
import createError from 'http-errors';

class GuideController extends BaseController {
  constructor() {
    const model = GuideModel;
    const options: any = {
      model,
    };
    options.populateFields = 'tags cookbook';
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

    return await super.create(req, res, next);
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
