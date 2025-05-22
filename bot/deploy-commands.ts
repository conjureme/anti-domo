import {
  REST,
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { bot_token, client_id, guild_id } = process.env;

if (!bot_token || !client_id) {
  console.error('missing environment variables bot_token or client_id');
  process.exit(1);
}

async function deployCommands() {
  const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('ts') || file.endsWith('js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    const commandData = command.default || command[Object.keys(command)[0]];

    if (commandData?.data?.toJSON()) {
      commands.push(commandData.data.toJSON());
      console.log(`registered: ${commandData.data.name}`);
    }
  }

  const rest = new REST().setToken(bot_token!);

  try {
    console.log(`starting refresh of ${commands.length} commands.`);

    let data;
    if (guild_id) {
      data = await rest.put(
        Routes.applicationGuildCommands(client_id!, guild_id),
        { body: commands }
      );
      console.log(
        `deployed ${Array.isArray(data) ? data.length : 0} guild commands`
      );
    } else {
      data = await rest.put(Routes.applicationCommands(client_id!), {
        body: commands,
      });
      console.log(
        `deployed ${Array.isArray(data) ? data.length : 0} global commands`
      );
    }
  } catch (error) {
    console.error('error deploying commands:', error);
  }
}

deployCommands();
