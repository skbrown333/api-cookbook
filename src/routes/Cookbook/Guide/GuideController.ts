import BaseController from "../../../base/BaseController";
import { GuideModel } from "../../../models/Guide/guide.model";

class GuideController extends BaseController {
  constructor() {
    let model = GuideModel;
    let options: any = {
      model,
    };
    options.populateFields = "character post tag cookbook";
    options.routeSingular = "guide";
    super(options);
  }

  async create(req, res, next) {
    const body = req.body;
    const { cookbook } = req.params;
    const options = {
      ...{ cookbook },
      ...{ body },
    };
    console.log("GuideController----------------------\n", req.params);

    super.create(req, res, next, options);
  }
}

export default new GuideController();
