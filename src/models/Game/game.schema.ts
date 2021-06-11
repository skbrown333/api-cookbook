import { Schema } from 'mongoose';

const schemaOptions = {
  versionKey: false,
};

const GameSchema = new Schema(
  {
    name: { type: String, required: true },
    display_name: { type: String, required: true },
  },
  schemaOptions,
);

export default GameSchema;
