import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { Command } from '../types';

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('checks if the bot is alive'),

  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: 'hi i am alive',
    });
  },
};
