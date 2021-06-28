import { Document, Model } from 'mongoose';

export interface IGame {
  name: string;
  display_name: string;
  subdomain: string;
}

export interface IGameDocument extends IGame, Document {}
export interface IGameModel extends Model<IGameDocument> {}
