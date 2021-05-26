import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let CookbookSchema = new Schema(
  {
    cre_date: {
      type: String,
      required: true,
      default: new Date().toDateString(),
    },
    subdomain: { type: String, required: true },
    name: { type: String, required: true },
    character: {
      type: Schema.Types.ObjectId,
      ref: "character",
      required: true,
    },
    game: { type: Schema.Types.ObjectId, ref: "game", required: true },
    streams: { type: Array, required: true, default: [] },
  },
  schemaOptions
);

export default CookbookSchema;
