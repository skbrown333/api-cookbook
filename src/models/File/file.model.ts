import { model } from 'mongoose';
import { IFileDocument, IFileModel } from './file.types';
import FileSchema from './file.schema';

export const FileModel = model<IFileDocument, IFileModel>('file', FileSchema);