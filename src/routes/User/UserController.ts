import BaseController from '../../base/BaseController';
import { UserModel } from '../../models/User/user.model';

class UserController extends BaseController {
  constructor() {
    const model = UserModel;
    const options: any = {
      model,
    };
    options.populateFields = 'cookbook';
    options.routeSingular = 'user';
    super(options);
  }
}

export default new UserController();
