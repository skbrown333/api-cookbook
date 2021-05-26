import BaseController from "../../base/BaseController";
import { TagModel } from "../../models/Tag/tag.model";

class TagController extends BaseController {
  constructor() {
    let model = TagModel;
    let options: any = {
      model,
    };
    super(options);
  }
}

export default new TagController();
