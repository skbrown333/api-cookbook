import BaseController from "../../base/BaseController";
import { CharacterModel } from "../../models/Character/character.model";

class CharacterController extends BaseController {
  constructor() {
    let model = CharacterModel;
    let options: any = {
      model,
    };
    options.populateFields = "game";
    super(options);
  }
}

export default new CharacterController();
