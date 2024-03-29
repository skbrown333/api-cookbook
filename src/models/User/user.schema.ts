import { Schema } from 'mongoose';

const schemaOptions = {
  versionKey: false,
};

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    uid: { type: String, required: true },
    discord_id: { type: String, required: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    avatar: { type: String, required: false },
    super_admin: { type: Boolean, required: true, default: false },
    links: { type: Object, required: true, default: {} },
  },
  schemaOptions,
);

export default UserSchema;
