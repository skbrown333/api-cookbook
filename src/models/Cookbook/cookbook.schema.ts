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
    name: { type: String, required: true },
    character: {
      type: Schema.Types.ObjectId,
      ref: 'character',
      required: true,
    },
    game: { type: Schema.Types.ObjectId, ref: 'game', required: true },
    streams: [{ type: String, required: true, default: [] }],
    roles: { type: Object, required: true, default: {} },
    donation_url: { type: String, required: false },
  },
  schemaOptions,
);

export default CookbookSchema;
