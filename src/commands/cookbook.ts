import { CookbookModel } from '../models/Cookbook/cookbook.model';
import { GuildModel } from '../models/Guild/guild.model';

const { SlashCommandBuilder } = require('@discordjs/builders');

export const CookbookCommand = (cookbooks) => {
  return {
    data: new SlashCommandBuilder()
      .setName('cookbook')
      .setDescription("Sets the server's cookbook")
      .addStringOption((option) => {
        option
          .setName('cookbook')
          .setDescription('The gif category')
          .setRequired(true);
        option.addChoice('Unset', 'null');
        cookbooks.forEach((cookbook) => {
          option.addChoice(cookbook.name, cookbook._id.toString());
        });

        return option;
      }),
    async execute(interaction) {
      try {
        const guildId = interaction.guild.id;
        const cookbookId = interaction.options.getString('cookbook');
        const guilds = await GuildModel.find({ guild: guildId }).populate(
          'cookbook',
        );
        let guild = guilds[0] || null;
        let cookbook;
        if (cookbookId === 'null') {
          cookbook = { _id: null };
        } else cookbook = await CookbookModel.findById(cookbookId);

        if (!guild) {
          guild = await GuildModel.create({
            guild: guildId,
            cookbook: interaction.options.getString('cookbook'),
          });
        } else if (guild) {
          guild.cookbook = cookbook._id;
          await guild.save();
        }

        interaction.reply({
          //@ts-ignore
          content: `cookbook set to: ${cookbook.name}`,
        });
      } catch (err) {
        console.log(err);
      }
    },
  };
};
