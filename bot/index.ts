import { Client, Collection, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Command } from './types';

dotenv.config({ path: '.env.local' });

const { bot_token } = process.env;

if (!bot_token) {
  console.error('bot_token is required in env file');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
});

client.commands = new Collection<string, Command>();

const loadCommands = () => {
  const commandsPath = path.join(__dirname, 'commands');

  if (!fs.existsSync(commandsPath)) {
    console.warn('commands directory not found');
    return;
  }

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    const commandData = command.default || command[Object.keys(command)[0]];

    if (commandData?.data?.name && commandData?.execute) {
      client.commands.set(commandData.data.name, commandData);
      console.log(`loaded command: ${commandData.data.name}`);
    } else {
      console.warn(
        `command at ${filePath} is missing required data or execute properties`
      );
    }
  }
};

const loadEvents = () => {
  const eventsPath = path.join(__dirname, 'events');

  if (!fs.existsSync(eventsPath)) {
    console.warn('events directory not found');
  }

  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    const eventData = event.default || event;

    if (eventData?.name && eventData?.execute) {
      if (eventData.once) {
        client.once(eventData.name, (...args) => eventData.execute(...args));
      } else {
        client.on(eventData.name, (...args) => eventData.execute(...args));
      }
      console.log(`loaded event: ${eventData.name}`);
    } else {
      console.warn(
        `event at ${filePath} is missing required name or execute properties`
      );
    }
  }
};

const startBot = async () => {
  console.log('starting bot...');

  loadCommands();
  loadEvents();

  try {
    await client.login(bot_token);
  } catch (error) {
    console.error('failed to login:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => {
  console.log('\nreceived SIGINT, shutting down...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nreceived SIGTERM, shutting down...');
  client.destroy();
  process.exit(0);
});

startBot();
