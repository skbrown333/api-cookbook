import BaseController from '../../base/BaseController';
import { CharacterModel } from '../../models/Character/character.model';

class CharacterController extends BaseController {
  constructor() {
    const model = CharacterModel;
    const options: any = {
      model,
    };
    options.populateFields = 'game';
    super(options);
  }
}

export default new CharacterController();
