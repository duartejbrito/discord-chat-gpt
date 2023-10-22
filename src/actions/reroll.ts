import { Client, ButtonInteraction, CacheType } from 'discord.js';
import { Action, CustomIdContext } from '../action';
import { createImage, imagesFromBase64Response } from '../utils/openai';
import { createResponse, handleOpenAIError } from '../utils/discord';
import { imagineActions } from '../actions';

export const Reroll: Action = {
  displayText: '🎲 Reroll',
  isAction: function (customId: string): boolean {
    return customId.startsWith('reroll:');
  },
  customId: function (context: CustomIdContext): string {
    return `reroll:${context.count}`;
  },
  run: async function (client: Client<boolean>, interaction: ButtonInteraction<CacheType>): Promise<void> {
    if (interaction.message.embeds.length == 0) {
      return;
    }
    const customId = interaction.customId;
    const matchResults = customId.match(/reroll:(\d)/);
    if (!matchResults || matchResults.length != 2) {
      return;
    }

    const embed = interaction.message.embeds[0];
    const prompt = embed.description;
    if (prompt == null) {
      await interaction.reply('Prompt must exist.');
      return;
    }

    const count = parseInt(matchResults[1]);
    const uuid = interaction.user.id;

    await interaction.reply({ content: `Rerolling for <@${uuid}>... 🎲` }).catch(console.error);

    try {
      const completion = await createImage(prompt, count);
      const images = imagesFromBase64Response(completion);
      const response = await createResponse(prompt, images, imagineActions(count));
      interaction.followUp({ ...response, content: `Rerolled for <@${uuid}>! 🎲` }).catch(console.error);
    } catch (error) {
      const response = handleOpenAIError(error, prompt);
      interaction.editReply({ ...response }).catch(console.error);
    }
  },
};
