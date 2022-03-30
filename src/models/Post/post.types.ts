import { Document, Model, Schema } from 'mongoose';

export interface IPost {
  cre_date: Date;
  cre_account?: Schema.Types.ObjectId;
  title: string;
  body?: string;
  cookbook: string;
  character?: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  likes: number;
}

export interface IPostDocument extends IPost, Document {}
export interface IPostModel extends Model<IPostDocument> {}
