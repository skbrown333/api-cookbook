import { Document, Model, Schema } from 'mongoose';

export interface IFile {
  filename: string;
  mime_type: string;
  file_size: number;
  encoding: string;
  gfycat: string;
  cookbook: Schema.Types.ObjectId;
}

export interface IFileDocument extends IFile, Document {}
export interface IFileModel extends Model<IFileDocument> {}