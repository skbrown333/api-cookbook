import { model } from 'mongoose';
import { ILikeDocument, ILikeModel } from './like.types';
import LikeSchema from './like.schema';

export const LikeModel = model<ILikeDocument, ILikeModel>('like', LikeSchema);
