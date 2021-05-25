import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let CookbookSchema = new Schema(
  {
    cre_date: { type: String, required: true },
    subdomain: { type: String, required: true },
    name: { type: String, required: true },
    character: { type: Schema.Types.ObjectId, required: true },
    game: { type: Schema.Types.ObjectId, required: true },
    streams: { type: Array, required: true },
  },
  schemaOptions
);

export default CookbookSchema;
