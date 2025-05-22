import { Events, Client } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`bot awake and logged in as ${client.user?.tag}`);
    console.log(`currently in ${client.guilds.cache.size} servers`);
  },
};
