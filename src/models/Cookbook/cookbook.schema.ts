import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let CookbookSchema = new Schema(
  {
    cre_date: {
      type: Date,
      required: true,
      default: new Date(),
    },
    subdomain: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    character: {
      type: Schema.Types.ObjectId,
      ref: "character",
      required: true,
    },
    game: { type: Schema.Types.ObjectId, ref: "game", required: true },
    streams: [{ type: String, required: true, default: [] }],
    roles: { type: Object, required: true, default: {} },
  },
  schemaOptions
);

export default CookbookSchema;
