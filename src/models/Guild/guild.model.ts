import { model } from 'mongoose';
import { IGuildDocument, IGuildModel } from './guild.types';
import GuildSchema from './guild.schema';

export const GuildModel = model<IGuildDocument, IGuildModel>(
  'guild',
  GuildSchema,
);
