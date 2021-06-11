import { Document, Model, Schema } from 'mongoose';

export interface IUser {
  email: string;
  uid: string;
  discord_id: string;
  username: string;
  discriminator: string;
  avatar: string;
  cookbook: Schema.Types.ObjectId;
  super_admin: boolean;
}

export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}
