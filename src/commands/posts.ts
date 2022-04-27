import { GuildModel } from '../models/Guild/guild.model';
import { PostModel } from '../models/Post/post.model';
import { postEmbed } from '../utils/utils';

const { SlashCommandBuilder } = require('@discordjs/builders');

export const PostCommand = {
  data: new SlashCommandBuilder()
    .setName('posts')
    .setDescription('Grabs a random matching post')
    .addStringOption((option) => {
      option
        .setName('tags')
        .setDescription('tags to search for')
        .setRequired(false);

      return option;
    }),
  async execute(interaction) {
    try {
      const tags = interaction.options.getString('tags')?.split(' ');
      const guildId = interaction.guild.id;
      const guilds = await GuildModel.find({ guild: guildId });
      const guild: any = guilds[0] || null;

      let posts = await PostModel.find().populate('tags cre_account');
      posts = posts.filter((post) => {
        const cookbookCheck =
          !guild ||
          guild.cookbook === null ||
          post.cookbook.toString() === guild.cookbook.toString();
        const tagCheck =
          !tags ||
          tags.length < 1 ||
          tags.every((r) =>
            post.tags.map((t: any) => t.label.replace(/\s/g, '')).includes(r),
          );
        return cookbookCheck && tagCheck;
      });
      const post = posts[Math.floor(Math.random() * posts.length)];

      if (post) {
        interaction.reply({
          embeds: [postEmbed(post)],
        });
      } else {
        interaction.reply('No results found');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
