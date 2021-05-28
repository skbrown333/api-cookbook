import BaseController from "../../../base/BaseController";
import { GuideModel } from "../../../models/Guide/guide.model";

class GuideController extends BaseController {
  constructor() {
    let model = GuideModel;
    let options: any = {
      model,
    };
    options.populateFields = "tags cookbook";
    options.routeSingular = "guide";
    super(options);
  }
}

export default new GuideController();
