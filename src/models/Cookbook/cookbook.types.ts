import { Document, Model, Schema } from 'mongoose';

export interface ICookbook {
  cre_date: Date;
  subdomain: string;
  name: string;
  character: string;
  game: Schema.Types.ObjectId;
  streams: string[];
  roles: any;
  donation_url?: string;
}

export interface ICookbookDocument extends ICookbook, Document {}
export interface ICookbookModel extends Model<ICookbookDocument> {}
