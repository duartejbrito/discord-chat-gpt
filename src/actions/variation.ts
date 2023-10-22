import { Client, ButtonInteraction, CacheType, MessageComponentInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Action, CustomIdContext } from '../action';
import { actionsFromRow, createResponse, fetchImagesFromComposite, handleOpenAIError, rowFromActions } from '../utils/discord';
import { createImageVariation, imagesFromBase64Response } from '../utils/openai';
import { imagineActions } from '../actions';

export const Variation: Action = {
  displayText: '️️️️️🔀 Variation',
  isAction: function (customId: string): boolean {
    return customId.startsWith('variation:');
  },
  customId: function (context: CustomIdContext): string {
    return `variation:${context.count}`;
  },
  run: async function (client: Client<boolean>, interaction: ButtonInteraction<CacheType>): Promise<void> {
    if (interaction.message.embeds.length == 0) {
      interaction.deferUpdate();
      return;
    }
    if (interaction.message.components.length != 1) {
      // either missing buttons or already showing expand buttons (or other buttons)
      interaction.deferUpdate();
      return;
    }
    const customId = interaction.customId;
    const matchResults = customId.match(/variation:(\d)/);
    if (!matchResults || matchResults.length != 2) {
      interaction.deferUpdate();
      return;
    }

    const count = parseInt(matchResults[1]);
    if (count == 0) {
      interaction.deferUpdate();
      return;
    }
    if (count == 1) {
      await performVariationAction(interaction, 1, 1).catch((e) => console.log(e));
      return;
    }

    const existingActions = actionsFromRow(interaction.message.components[0]);
    const mainRow = rowFromActions(existingActions, { count: count });

    let row = new ActionRowBuilder<ButtonBuilder>();
    let newRows = [mainRow, row];

    for (let i = 0; i <= count; i++) {
      if (row.components.length == 5) {
        row = new ActionRowBuilder<ButtonBuilder>();
        newRows.push(row);
      }
      if (i == 0) {
        const button = new ButtonBuilder().setCustomId(`variation_picker:close`).setLabel(`❌`).setStyle(ButtonStyle.Secondary);
        row.addComponents(button);
      } else {
        const button = new ButtonBuilder().setCustomId(`variation_picker:${i}`).setLabel(`🔭 ${i}`).setStyle(ButtonStyle.Secondary);
        row.addComponents(button);
      }
    }

    await interaction.update({ components: newRows as any });

    const collector = interaction.message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 6000 });
    collector.on('collect', (i) => {
      if (i.user.id === interaction.user.id && i.customId.startsWith('variation_picker:')) {
        collector.stop();
        const matchResults = i.customId.match(/variation_picker:(\d)/);
        if (matchResults && matchResults.length == 2) {
          const step = parseInt(matchResults[1]);
          if (step) {
            performVariationAction(i, step, count).catch(console.log);
            return;
          }
        }
        i.deferUpdate();
      }
    });

    collector.on('end', (collected) => {
      interaction.editReply({ components: [mainRow as any] });
    });
  },
};

async function performVariationAction(interaction: MessageComponentInteraction, step: number, count: number) {
  if (step == 0 || interaction.message.embeds.length == 0) {
    return;
  }
  const embed = interaction.message.embeds[0];
  const images = await fetchImagesFromComposite(embed.image, count).catch(console.error);
  const index = step - 1;

  if (images == null || images.length <= index) {
    interaction.reply({ ephemeral: true, content: 'Failed to process images for Expand.' }).catch(console.error);
    return;
  }

  await interaction.deferReply();
  const prompt = embed.description ?? '';
  const uuid = interaction.user.id;
  const originalImage = images[index];

  try {
    const completion = await createImageVariation(originalImage);
    const images = imagesFromBase64Response(completion);
    const response = await createResponse(prompt, images, imagineActions(count));
    interaction.followUp({ ...response, content: `Variations for <@${uuid}>! 🔭` }).catch(console.error);
  } catch (error) {
    const response = handleOpenAIError(error, prompt);
    interaction.followUp({ ...response }).catch(console.error);
  }
}
