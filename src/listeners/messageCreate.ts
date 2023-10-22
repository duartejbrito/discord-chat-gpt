import { Client, Events } from 'discord.js';
import { logMessage, splitStringByLimit } from '../utils';
import { createChatCompletion, startConversionLog } from '../utils/openai';
import { shouldReturn } from '../utils/discord';

export default (client: Client): void => {
  client.on(Events.MessageCreate, async (message) => {
    if (await shouldReturn(client, message)) return;

    let conversationLog = startConversionLog();

    try {
      await message.channel.sendTyping();

      const prevMessages = await message.channel.messages.fetch({ limit: 15 });
      prevMessages.reverse();

      prevMessages.forEach((m) => {
        conversationLog.push({ role: 'user', content: m.content });
      });

      const result = await createChatCompletion(conversationLog);

      const resultContent = result?.choices[0].message.content;

      logMessage(`Author: "${message.author.username}", Message: "${message.content}", Is Private: ${message.guild === null}, Bot Reply: "${resultContent}"`);

      splitStringByLimit(resultContent!, 2000).forEach((m) => {
        if (message.guild === null) {
          message.author.send(m);
        } else {
          message.reply({ content: m });
        }
      });
    } catch (error) {
      logMessage(`ERR: ${error}`);
    }
  });
};
