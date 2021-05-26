import { Document, Model } from "mongoose";

export interface IGame {
  name: string;
}

export interface IGameDocument extends IGame, Document {}
export interface IGameModel extends Model<IGameDocument> {}
