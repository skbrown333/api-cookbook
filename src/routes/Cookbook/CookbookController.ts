import BaseController from '../../base/BaseController';
import { CookbookModel } from '../../models/Cookbook/cookbook.model';

class CookbookController extends BaseController {
  constructor() {
    const model = CookbookModel;
    const options: any = {
      model,
    };
    options.populateFields = 'game';
    options.routeSingular = 'cookbook';
    super(options);
  }
}

export default new CookbookController();
