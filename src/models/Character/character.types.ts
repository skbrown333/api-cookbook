import { Document, Model, Schema } from 'mongoose';

export interface ICharacter {
  name: string;
  display_name: string;
  game: Schema.Types.ObjectId;
}

export interface ICharacterDocument extends ICharacter, Document {}
export interface ICharacterModel extends Model<ICharacterDocument> {}
