import { Document, Model, Schema } from "mongoose";

export interface ITag {
  label: string;
  color?: string;
}

export interface ITagDocument extends ITag, Document {}
export interface ITagModel extends Model<ITagDocument> {}
