import { Document, Model, Schema } from 'mongoose';

export interface IGuide {
  cre_date: Date;
  cre_account?: Schema.Types.ObjectId;
  title: string;
  description?: string;
  cookbook: Schema.Types.ObjectId;
  character?: Schema.Types.ObjectId;
  sections: any[];
  tags: Schema.Types.ObjectId[];
  slug: string;
}

export interface IGuideDocument extends IGuide, Document {}
export interface IGuideModel extends Model<IGuideDocument> {}
