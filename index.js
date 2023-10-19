require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { OpenAI } = require('openai');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ] 
});

client.on('ready', () => {
    console.log('Bot is ready!');
    console.log(`OpenAi API Key: ${process.env.OPENAI_API_KEY}`);
    console.log(`Discord Token: ${process.env.TOKEN}`);
    console.log(`Channel ID: ${process.env.CHANNEL_ID}`);
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;
    if (message.content.startsWith('!')) return;

    let conversationLog = [{ role: 'system', content: 'You are a friendly chatbot.' }];

    try {
        await message.channel.sendTyping();

        const prevMessages = await message.channel.messages.fetch({ limit: 15 });
        prevMessages.reverse();

        prevMessages.forEach((m) => {
            conversationLog.push({ role: 'user', content: m.content });
        });

        const result = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversationLog,
        })
        .catch((error) => {
            console.log(`ERR: ${error}`);
        });

        message.reply(result.choices[0].message);

    } catch (error) {
        console.log(`ERR: ${error}`);
    }
});

client.login(process.env.TOKEN);