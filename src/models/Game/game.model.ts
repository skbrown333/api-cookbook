import { model } from 'mongoose';
import { IGameDocument, IGameModel } from './game.types';
import GameSchema from './game.schema';

export const GameModel = model<IGameDocument, IGameModel>('game', GameSchema);
