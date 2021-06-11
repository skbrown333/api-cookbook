import { Schema } from 'mongoose';

const schemaOptions = {
  versionKey: false,
};

const CharacterSchema = new Schema(
  {
    name: { type: String, required: true },
    display_name: { type: String, required: true },
    game: { type: Schema.Types.ObjectId, ref: 'game', required: true },
  },
  schemaOptions,
);

export default CharacterSchema;
