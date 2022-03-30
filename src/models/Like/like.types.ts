import { Document, Model, Schema } from 'mongoose';

export interface ILike {
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
}

export interface ILikeDocument extends ILike, Document {}
export interface ILikeModel extends Model<ILikeDocument> {}
