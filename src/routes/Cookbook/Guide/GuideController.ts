import BaseController from '../../../base/BaseController';
import { GuideModel } from '../../../models/Guide/guide.model';

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

    let {slug} = req.body;
    const { cookbook } = req.params;

    if (!slug) {
      return super.create(req, res, next);
    }

    const guides = await GuideModel.find({cookbook, slug});

    if (guides.length) {
      return next(new Error('Slug already exists'));
    }

    super.create(req, res, next);
  }
}

export default new GuideController();
