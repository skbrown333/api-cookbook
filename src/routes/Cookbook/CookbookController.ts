import BaseController from "../../base/BaseController";
import { CookbookModel } from "../../models/Cookbook/cookbook.model";

class CookbookController extends BaseController {
  constructor() {
    let model = CookbookModel;
    super({ model });
  }
}

export default new CookbookController();
