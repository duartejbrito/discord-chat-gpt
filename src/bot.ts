import { TOKEN } from './utils/constants';
import { Client, IntentsBitField, Partials } from 'discord.js';
import ready from './listeners/ready';
import messageCreate from './listeners/messageCreate';
import interactionCreate from './listeners/interactionCreate';

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.DirectMessages],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

ready(client);
messageCreate(client);
interactionCreate(client);

process.on('unhandledRejection', (e) => console.log(e));
process.on('uncaughtException', (e) => console.log(e));
process.on('uncaughtExceptionMonitor', (e) => console.log(e));

client.login(TOKEN);
