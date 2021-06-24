import { Document, Model, Schema } from 'mongoose';

export interface IUser {
  email: string;
  uid: string;
  discord_id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  super_admin: boolean;
  links: any;
}

export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}
