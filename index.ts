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

const COOKBOOK_ID = '60ae98dd749bb3001580a0b6';
const COOKBOOK_DISCORD_ID = '729819302726729809';
const CHEF_ID = '148672183961518080';

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
    console.log('Ready?');

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
    if (
      message.content.match(
        /(?=https:\/\/)(?=.*cookbook.gg)(?=.*\/posts)\S*/g,
      ) &&
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

    if (
      message.guildId === COOKBOOK_DISCORD_ID &&
      message.author.id === CHEF_ID
    ) {
      if (message.content.includes('gfy')) {
        const _channel = client.channels.cache.find(
          (channel) => channel.id === message.channel.id,
        );
        const _category = client.channels.cache.find(
          (channel) => channel.id === message.channel.parentId,
        );
        let channelTag = await TagModel.findOne({
          label: _channel.name,
          //@ts-ignore
          cookbook: COOKBOOK_ID,
        });
        if (!channelTag) {
          channelTag = await TagModel.create({
            cookbook: COOKBOOK_ID,
            label: _channel.name,
          });
        }

        let categoryTag = await TagModel.findOne({
          label: _category.name,
          //@ts-ignore
          cookbook: COOKBOOK_ID,
        });
        if (!categoryTag) {
          categoryTag = await TagModel.create({
            cookbook: COOKBOOK_ID,
            label: _category.name,
          });
        }
        const user = await UserModel.findOne({ discord_id: message.author.id });
        let post: any = await PostModel.create({
          title: _category.name,
          cre_account: user?._id,
          body: message.content.replace(
            /(https:\/\/)(gfycat)[^\s\,]*/g,
            (match) => `gif:${match}`,
          ),
          tags: [categoryTag._id, channelTag._id],
          cookbook: COOKBOOK_ID,
        });

        post = await post
          .populate('cre_account tags cookbook character')
          .execPopulate();
        post.body = await parseGfy(post.body);
        await updateFollowers(client, post);
      }
    }
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
