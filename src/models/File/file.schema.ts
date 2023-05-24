import { Schema } from 'mongoose';

const schemaOptions = {
  versionKey: false,
};

const FileSchema = new Schema(
  {
    filename: { type: String, required: true },
    mime_type: { type: String, required: true },
    file_size: { type: Number, required: true},
    encoding: { type: String, required: true },
    gfycat: { type: String, required: false },
    cookbook: {
        type: Schema.Types.ObjectId,
        ref: 'cookbook',
        required: false,
    },
  },
  schemaOptions,
);

export default FileSchema;
