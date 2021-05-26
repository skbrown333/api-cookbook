import { Schema } from "mongoose";

let schemaOptions = {
  versionKey: false,
};

let TagSchema = new Schema(
  {
    email: { type: String, required: true },
    uid: { type: String, required: true },
    discord_id: { type: String, required: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  schemaOptions
);

export default TagSchema;
