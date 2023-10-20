require('dotenv/config');
const { Client, IntentsBitField, Partials, Events } = require('discord.js');
const { OpenAI } = require('openai');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.on(Events.ClientReady, () => {
    logMessage('Bot is ready!');
    logMessage('================================================================================');
    logMessage(`OpenAi API Key: ${process.env.OPENAI_API_KEY}`);
    logMessage(`OpenAi Model ID: ${process.env.OPENAI_MODEL_ID}`);
    logMessage(`OpenAi Start Message: ${process.env.OPENAI_START_MESSAGE}`);
    logMessage('================================================================================');
    logMessage(`Discord Token: ${process.env.TOKEN}`);
    logMessage(`Channel ID: ${process.env.CHANNEL_ID}`);
    logMessage(`Guild ID: ${process.env.GUILD_ID}`);
    logMessage(`Role ID: ${process.env.ROLE_ID}`);
    logMessage('================================================================================');
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

client.on(Events.MessageCreate, async (message) => {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const member = await guild.members.fetch(message.author.id)
        .then((member) => {
            return member;
        })
        .catch(() => {
            return null;
        });
    const hasPermission = member !== null ? member.roles.cache.has(process.env.ROLE_ID) : false;

    if (message.author.bot) return;
    if (message.guild !== null && message.channel.id !== process.env.CHANNEL_ID) return;
    if (message.guild === null && !hasPermission) return;
    if (message.content.startsWith('!')) return;

    let conversationLog = [{ role: 'system', content: process.env.OPENAI_START_MESSAGE }];

    try {
        await message.channel.sendTyping();

        const prevMessages = await message.channel.messages.fetch({ limit: 15 });
        prevMessages.reverse();

        prevMessages.forEach((m) => {
            conversationLog.push({ role: 'user', content: m.content });
        });

        const result = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_ID,
            messages: conversationLog,
        })
        .catch((error) => {
            logMessage(`ERR: ${error}`);
        });

        logMessage(`Author: "${member.displayName}", Message: "${message.content}", Is Private: ${message.guild === null}, Bot Reply: "${result.choices[0].message.content}"`);

        const messageContent = result.choices[0].message.content;

        splitStringByLimit(messageContent, 2000).forEach((m) => {
            if (message.guild === null) {
                message.author.send(m);
            } else {
                result.choices[0].message.content = m;
                message.reply(result.choices[0].message);
            }
        });

    } catch (error) {
        logMessage(`ERR: ${error}`);
    }
});

client.login(process.env.TOKEN);

function logMessage(message) {
    console.log(`[${new Date().toLocaleString()}] ${message}`);
}

function splitStringByLimit(str, limit) {
    let result = [];
    let index = 0;
  
    while (index < str.length) {
      result.push(str.substr(index, limit));
      index += limit;
    }
  
    return result;
  }