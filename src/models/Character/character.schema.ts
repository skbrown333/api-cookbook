import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let CharacterSchema = new Schema(
  {
    name: { type: String, required: true },
    game: { type: Schema.Types.ObjectId, required: true },
  },
  schemaOptions
);

export default CharacterSchema;
