import BaseController from '../../base/BaseController';
import { GameModel } from '../../models/Game/game.model';

class GameController extends BaseController {
  constructor() {
    const model = GameModel;
    super({ model });
  }
}

export default new GameController();
