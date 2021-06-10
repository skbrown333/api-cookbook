import BaseController from '../../../base/BaseController';
import { TagModel } from '../../../models/Tag/tag.model';

class TagController extends BaseController {
  constructor() {
    const model = TagModel;
    const options: any = {
      model,
    };
    options.populateFields = 'cookbook';
    options.routeSingular = 'tag';
    super(options);
  }
}

export default new TagController();
