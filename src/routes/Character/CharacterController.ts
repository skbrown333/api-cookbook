import BaseController from "../../base/BaseController";
import { CharacterModel } from "../../models/Character/character.model";

class CharacterController extends BaseController {
  constructor() {
    let model = CharacterModel;
    super({ model });
  }
}

export default new CharacterController();
