import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let TagSchema = new Schema(
  {
    label: { type: String, required: true },
    color: { type: String, required: false },
    cookbook: {
      type: Schema.Types.ObjectId,
      ref: "cookbook",
      required: false,
    },
  },
  schemaOptions
);

export default TagSchema;
