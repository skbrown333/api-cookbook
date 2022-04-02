require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import createError from 'http-errors';
import cron from 'node-cron';

const app = express();

import { logger as log } from './src/utils/logging';

import routes from './src/routes/index';

import { ENV } from './src/constants/constants';
import { guideEmbed, postEmbed, updateUsers } from './src/utils/utils';
import { Client, Intents } from 'discord.js';
import { PostModel } from './src/models/Post/post.model';
import { GuideModel } from './src/models/Guide/guide.model';

mongoose.connect(ENV.db_url);

// When successfully connected
mongoose.connection.on('connected', () => {
  log.info('Established Mongoose Default Connection');
});

// When connection throws an error
mongoose.connection.on('error', (err) => {
  log.error('Mongoose Default Connection Error : ' + err);
});

cron.schedule('* */8 * * *', updateUsers);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  log.info(`Server running on port ${port}`);
});

app.use(helmet());
const allowedOrigins = [
  'dev-coobook.com',
  'cookbook-gg.vercel.app',
  ...(process.env.CORS ? [process.env.CORS] : []),
];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(createError(500, 'Blocked by CORS'));
    }

    for (let i = 0; i < allowedOrigins.length; i++) {
      const allowedOrigin = allowedOrigins[i];
      if (origin.indexOf(allowedOrigin)) {
        return callback(null, true);
      }
    }

    callback(createError(500, 'Blocked by CORS'));
  },
};
app.use(cors(corsOptions));

const morganLogStyle =
  ':method :url :status :response-time ms - :res[content-length]';

app.use(
  morgan(morganLogStyle, {
    stream: {
      write: (str) => {
        log.info(str);
      },
    },
  }),
);

app.use(express.json());
app.use('/', routes);

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once('ready', () => {
  console.log('Ready?');
});

client.on('messageCreate', async (message) => {
  if (
    message.content.match(/(?=https:\/\/)(?=.*cookbook.gg)(?=.*\/posts)\S*/g) &&
    message.author !== client.user
  ) {
    const postId = message.content.match(/(?<=\/posts\/)(\S*)/g);
    try {
      const post = await PostModel.findById(postId).populate(
        'cre_account tags cookbook character',
      );
      if (!post) return;

      message.delete();
      message.channel.send({
        embeds: [postEmbed(post)],
      });
    } catch (e) {
      console.log(e);
    }
  }

  if (
    message.content.match(
      /(?=https:\/\/)(?=.*cookbook.gg)(?=.*\/section)\S*/g,
    ) &&
    message.author !== client.user
  ) {
    const guideId = message.content.match(/(?<=\/recipes\/)(\S[^\/]*)/g)?.[0];
    const sectionName = message.content.match(/(?<=\/section\/)(\S*)/g)?.[0];
    try {
      const guide = await GuideModel.findById(guideId).populate(
        'tags cookbook character',
      );
      if (!guide || !guide.sections || !sectionName) return;

      const section = guide.sections.find(
        (section) => `${section.title}` === decodeURIComponent(sectionName),
      );

      message.delete();
      message.channel.send({
        embeds: [guideEmbed(guide, section)],
      });
    } catch (e) {
      console.log(e);
    }
  }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);
