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
}

export default new GuideController();
