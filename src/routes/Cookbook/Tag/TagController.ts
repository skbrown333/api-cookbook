import createError from 'http-errors';
import BaseController from '../../../base/BaseController';
import { PostModel } from '../../../models/Post/post.model';
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

  async delete(req, res, next) {
    if (!req.params || !req.params[this.routeSingular]) {
      return next(createError(500, 'Missing required params'));
    }

    const modelId = req.params[this.routeSingular];
    const posts = await PostModel.find({ tags: { $all: [modelId] } });

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      post.tags = post.tags.filter((p: any) => {
        if (p._id.toString() !== modelId) return p;
      });
      await post.save();
    }

    return await super.delete(req, res, next);
  }
}

export default new TagController();
