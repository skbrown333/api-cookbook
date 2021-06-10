import { Schema } from 'mongoose';

const schemaOptions = {
  versionKey: false,
};

const GuideSchema = new Schema(
  {
    cre_date: { type: Date, required: true, default: new Date() },
    cre_account: { type: Schema.Types.ObjectId, required: false },
    title: { type: String, required: true },
    description: { type: String, required: false },
    cookbook: {
      type: Schema.Types.ObjectId,
      ref: 'cookbook',
      required: true,
    },
    character: {
      type: String,
      required: false,
    },
    sections: [{ type: Object, required: true, default: [] }],
    tags: [
      { type: Schema.Types.ObjectId, ref: 'tag', required: true, default: [] },
    ],
    slug: {
      type: String, 
      required: true, 
      default: function() {
        const _t = this as any;
        return _t._id;
      },
      validate: {
        validator: function(value) {
          return /^[a-zA-Z0-9_-]{3,45}$/g.test(value);
        },
        message: 'Invalid slug provided',
      },
    },
  },
  schemaOptions,
);

export default GuideSchema;
