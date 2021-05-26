import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let CharacterSchema = new Schema(
  {
    name: { type: String, required: true },
    display_name: { type: String, required: true },
    game: { type: Schema.Types.ObjectId, ref: "game", required: true },
  },
  schemaOptions
);

export default CharacterSchema;
