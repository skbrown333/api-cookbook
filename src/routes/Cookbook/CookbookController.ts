import BaseController from "../../base/BaseController";
import { CookbookModel } from "../../models/Cookbook/cookbook.model";

class CookbookController extends BaseController {
  constructor() {
    let model = CookbookModel;
    let options: any = {
      model,
    };
    options.populateFields = "game character";
    options.routeSingular = "cookbook";
    super(options);
  }
}

export default new CookbookController();
