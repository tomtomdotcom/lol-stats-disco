import * as Discord from 'discord.js';
import { processCommand } from './helpers';

const client = new Discord.Client();
const bot_secret_token = process.env.DISCO_BOT_TOKEN;

client.on('ready', () => {
  client.user.setActivity('monitoring the halls');
  client.guilds.forEach(guild => {
    console.log(`Connected as ${client.user.tag} to ${guild.name}`);
  });
});

client.on('message', message => {
  if (message.author == client.user) {
    // Prevent bot from responding to its own messages
    return;
  }

  if (message.content.startsWith('!')) {
    processCommand(message);
  }
});

client.login(bot_secret_token);
