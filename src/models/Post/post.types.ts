import { Document, Model, Schema } from "mongoose";

export interface IPost {
  cre_date: Date;
  cre_account?: Schema.Types.ObjectId;
  title: string;
  body?: string;
  cookbook: Schema.Types.ObjectId;
  character?: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
}

export interface IPostDocument extends IPost, Document {}
export interface IPostModel extends Model<IPostDocument> {}
