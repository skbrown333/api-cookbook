import { Schema } from 'mongoose';

const schemaOptions = {
  versionKey: false,
};

const PostSchema = new Schema(
  {
    cre_date: { type: Date, required: true, default: new Date() },
    cre_account: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    title: { type: String, required: true },
    body: { type: String, required: false },
    cookbook: {
      type: Schema.Types.ObjectId,
      ref: 'cookbook',
      required: false,
    },
    character: {
      type: Schema.Types.ObjectId,
      ref: 'character',
      required: false,
    },
    tags: [
      { type: Schema.Types.ObjectId, ref: 'tag', required: true, default: [] },
    ],
    likes: { type: Number, required: true, default: 0 },
  },
  schemaOptions,
);

export default PostSchema;
