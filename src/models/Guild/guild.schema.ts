import { Schema } from 'mongoose';

const schemaOptions = {
  versionKey: false,
};

const GuildSchema = new Schema(
  {
    cookbook: { type: Schema.Types.ObjectId, ref: 'cookbook', required: false },
    guild: { type: String, required: true },
  },
  schemaOptions,
);

export default GuildSchema;
