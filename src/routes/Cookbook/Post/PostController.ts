import BaseController from '../../../base/BaseController';
import { PostModel } from '../../../models/Post/post.model';

class PostController extends BaseController {
  constructor() {
    const model = PostModel;
    const options: any = {
      model,
    };
    options.populateFields = 'cre_account tags cookbook';
    options.routeSingular = 'post';
    super(options);
  }
}

export default new PostController();
