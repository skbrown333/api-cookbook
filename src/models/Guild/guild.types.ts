import { Document, Model, Schema } from 'mongoose';

export interface IGuild {
  cookbook: Schema.Types.ObjectId;
  guild: string;
}

export interface IGuildDocument extends IGuild, Document {}
export interface IGuildModel extends Model<IGuildDocument> {}
