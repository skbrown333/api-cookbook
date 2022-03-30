import { Schema } from 'mongoose';

const schemaOptions = {
  versionKey: false,
};

const LikeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'post', required: true },
  },
  schemaOptions,
);

export default LikeSchema;
