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
import { updateUsers } from './src/utils/utils';
import { Client, Intents, MessageEmbed } from 'discord.js';
import { PostModel } from './src/models/Post/post.model';

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
      const gfyTransform = (url) => {
        const urlObject = { thumbnail: url, giant: url, gif: url };
        const [thumb, size, mobile, mp4, giant] = [
          'thumbs.',
          '-size_restricted.gif',
          '-mobile.mp4',
          '.mp4',
          'giant.',
        ];

        if (url.includes(thumb)) {
          urlObject.giant = url.replace(thumb, giant);
        }

        if (url.includes(size)) {
          urlObject.thumbnail = urlObject.thumbnail.replace(size, mobile);
          urlObject.giant = urlObject.giant.replace(size, mp4);
        }

        if (url.includes(mp4) && !url.includes(mobile)) {
          urlObject.thumbnail = urlObject.thumbnail.replace(mp4, mobile);
          urlObject.gif = urlObject.gif.replace(mp4, size);
        } else if (url.includes(mobile)) {
          urlObject.giant = urlObject.giant.replace(mobile, mp4);
          urlObject.gif = urlObject.gif.replace(mobile, size);
        }

        if (url.includes(giant)) {
          urlObject.thumbnail = url.replace(giant, thumb);
          urlObject.gif = urlObject.gif.replace(giant, thumb);
        }

        return urlObject;
      };
      const parseBody = (string) => {
        const matches = string.match(/(gif:)\S*/g);
        const { gif } = gfyTransform(matches[0].replace(/(gif:)/, ''));
        return {
          gifs: gif,
          body: string.replace(/(gif:)|(vid:)|(loop:)|(tweet:)/g, ''),
        };
      };
      const { gifs, body } = parseBody(post.body);
      const exampleEmbed = new MessageEmbed()
        .setColor('#09d3ac')
        .setTitle(post.title)
        .setURL(
          //@ts-ignore
          `https://melee.cookbook.gg/${encodeURI(post.cookbook.name)}/posts/${
            post._id
          }`,
        )
        .setAuthor({
          //@ts-ignore
          name: `${post.cre_account.username}#${post.cre_account.discriminator}`,
          //@ts-ignore
          iconURL: `https://cdn.discordapp.com/avatars/${post.cre_account.discord_id}/${post.cre_account.avatar}.png`,
        })
        .setDescription(body)
        .setImage(gifs)
        .setFooter({
          //@ts-ignore
          text: post.tags.map((tag) => `#${tag.label}`).join(' '),
        });
      message.delete();
      message.channel.send({
        embeds: [exampleEmbed],
      });
    } catch (e) {
      console.log(e);
    }
  }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);
