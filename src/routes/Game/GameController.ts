import BaseController from "../../base/BaseController";
import { GameModel } from "../../models/Game/game.model";

class GameController extends BaseController {
  constructor() {
    let model = GameModel;
    super({ model });
  }
}

export default new GameController();
