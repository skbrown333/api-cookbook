import { Document, Model } from "mongoose";

export interface IUser {
  email: string;
  uid: string;
  discord_id: string;
  username: string;
  discriminator: string;
  avatar: string;
}

export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}
