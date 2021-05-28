import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let GuideSchema = new Schema(
  {
    cre_date: { type: Date, required: true, default: new Date() },
    cre_account: { type: Schema.Types.ObjectId, required: false },
    title: { type: String, required: true },
    description: { type: String, required: false },
    cookbook: {
      type: Schema.Types.ObjectId,
      ref: "cookbook",
      required: true,
    },
    character: {
      type: String,
      required: false,
    },
    sections: [{ type: Object, required: true, default: [] }],
    tags: [
      { type: Schema.Types.ObjectId, ref: "tag", required: true, default: [] },
    ],
  },
  schemaOptions
);

export default GuideSchema;
