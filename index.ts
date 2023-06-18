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
import {
  guideEmbed,
  parseGfy,
  postEmbed,
  updateFollowers,
  updateUsers,
} from './src/utils/utils';
import { Client, Collection, Intents } from 'discord.js';
import { PostModel } from './src/models/Post/post.model';
import { GuideModel } from './src/models/Guide/guide.model';
import { Routes } from 'discord-api-types/rest/v9';
import { REST } from '@discordjs/rest';
import { CookbookCommand } from './src/commands/cookbook';
import { CookbookModel } from './src/models/Cookbook/cookbook.model';
import { PostCommand } from './src/commands/posts';
import { UserModel } from './src/models/User/user.model';
import { TagModel } from './src/models/Tag/tag.model';
import {
  embedGuide,
  embedPost,
  postFromDiscord,
} from './src/commands/messageCreate';

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
  'dev-cookbook.com',
  'cookbook-gg.vercel.app',
  ...(process.env.CORS ? [process.env.CORS] : []),
];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    console.log('🚀 ~ file: index.ts:68 ~ origin:', origin);

    if (!origin) {
      return callback(null, true);
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
const client: any = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const commands: any = [];

// Creating a collection for commands in client
client.commands = new Collection();

async function initCommands() {
  try {
    const cookbooks = await CookbookModel.find();
    const cookbookCommand = CookbookCommand(cookbooks);
    commands.push(cookbookCommand.data.toJSON());
    client.commands.set(cookbookCommand.data.name, cookbookCommand);
    const postCommand = PostCommand;
    commands.push(postCommand.data.toJSON());
    client.commands.set(postCommand.data.name, postCommand);
  } catch (err) {
    console.log('err: ', err);
  }
}

async function initBot() {
  await initCommands();

  client.once('ready', () => {
    const CLIENT_ID = client.user.id || '';
    const rest = new REST({
      version: '9',
    }).setToken(process.env.DISCORD_BOT_TOKEN || '');
    (async () => {
      try {
        client.guilds.cache.forEach(async (guild) => {
          await rest.put(
            //@ts-ignore
            Routes.applicationGuildCommands(CLIENT_ID, guild.id),
            {
              body: commands,
            },
          );
          console.log(
            `Successfully registered application commands for ${guild.name}`,
          );
        });
      } catch (error) {
        if (error) console.error(error);
      }
    })();
  });

  client.on('messageCreate', async (message) => {
    await embedPost(client, message);
    await embedGuide(client, message);
    await postFromDiscord(client, message);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      if (error) console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  });

  // Login to Discord with your client's token
  client.login(process.env.DISCORD_BOT_TOKEN);
}

initBot();
