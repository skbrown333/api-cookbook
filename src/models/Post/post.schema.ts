import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let PostSchema = new Schema(
  {
    cre_date: { type: Date, required: true, default: new Date() },
    cre_account: { type: Schema.Types.ObjectId, ref: "user", required: false },
    title: { type: String, required: true },
    body: { type: String, required: false },
    cookbook: {
      type: Schema.Types.ObjectId,
      ref: "cookbook",
      required: false,
    },
    character: {
      type: String,
      required: false,
    },
    tags: [
      { type: Schema.Types.ObjectId, ref: "tag", required: true, default: [] },
    ],
  },
  schemaOptions
);

export default PostSchema;
