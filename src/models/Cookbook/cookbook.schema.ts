import { Schema } from 'mongoose';

const schemaOptions = {
  versionKey: false,
};

const CookbookSchema = new Schema(
  {
    cre_date: {
      type: Date,
      required: true,
      default: new Date(),
    },
    subdomain: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    character: {
      type: String,
      required: true,
    },
    game: { type: Schema.Types.ObjectId, ref: 'game', required: true },
    streams: [{ type: String, required: true, default: [] }],
    roles: { type: Object, required: true, default: {} },
  },
  schemaOptions,
);

export default CookbookSchema;
