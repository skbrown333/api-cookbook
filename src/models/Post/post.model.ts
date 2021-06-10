import { model } from 'mongoose';
import { IPostDocument, IPostModel } from './post.types';
import PostSchema from './post.schema';

export const PostModel = model<IPostDocument, IPostModel>('post', PostSchema);
