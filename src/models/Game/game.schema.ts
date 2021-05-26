import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let GameSchema = new Schema(
  {
    name: { type: String, required: true },
    display_name: { type: String, required: true },
  },
  schemaOptions
);

export default GameSchema;
