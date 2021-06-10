import { model } from 'mongoose';
import { ICharacterDocument, ICharacterModel } from './character.types';
import CharacterSchema from './character.schema';

export const CharacterModel = model<ICharacterDocument, ICharacterModel>(
  'character',
  CharacterSchema,
);
