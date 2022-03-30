import createError from 'http-errors';
import BaseController from '../../../base/BaseController';
import { LikeModel } from '../../../models/Like/like.model';
import { PostModel } from '../../../models/Post/post.model';

class PostController extends BaseController {
  constructor() {
    const model = PostModel;
    const options: any = {
      model,
    };
    options.populateFields = 'cre_account tags cookbook character';
    options.routeSingular = 'post';
    super(options);
  }

  async like(req, res, next) {
    const body = req.body;
    if (!req.params || !req.params.post) {
      return next(createError(500, 'Missing required params'));
    }

    const modelId = req.params.post;
    let model = await PostModel.findById(modelId);

    if (!model) {
      return next(createError(500, 'Model Not Found'));
    }

    const { userId } = body;
    let users = await LikeModel.find({ user: userId, post: modelId });
    const user = users[0];

    if (user) {
      try {
        await LikeModel.deleteOne({
          user: userId,
          post: modelId,
        });
      } catch (err) {
        console.log('err: ', err);
      }
    } else {
      try {
        await LikeModel.create({ user: userId, post: modelId });
      } catch (err) {
        console.log('err: ', err);
      }
    }
    const count = await LikeModel.count({ post: modelId });
    model = await PostModel.findByIdAndUpdate(
      modelId,
      { likes: count },
      {
        new: true,
        runValidators: true,
      },
    );
    if (model) {
      model = await model
        .populate('cre_account tags cookbook character')
        .execPopulate();
    }

    return res.status(200).json(model);
  }
}

export default new PostController();
