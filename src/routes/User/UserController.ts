import BaseController from "../../base/BaseController";
import { UserModel } from "../../models/User/user.model";

class UserController extends BaseController {
  constructor() {
    let model = UserModel;
    let options: any = {
      model,
    };
    super(options);
  }
}

export default new UserController();
