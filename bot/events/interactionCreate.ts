import { Events, Interaction } from 'discord.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`no command ${interaction.commandName} found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `there was an error executing ${interaction.commandName}:`,
        error
      );

      const errorMessage = {
        content: 'something went wrong while executing this command!',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },
};
