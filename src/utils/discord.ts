import {
  ActionRow,
  ActionRowBuilder,
  AttachmentBuilder,
  BaseInteraction,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  EmbedImageData,
  Message,
  MessageActionRowComponent,
} from 'discord.js';
import { CHANNEL_ID, GUILD_ID, ROLE_ID } from './constants';
import { createTiledComposite, extractImagesFromComposite } from './image';
import { Action, CustomIdContext } from '../action';
import axios from 'axios';
import { Actions } from '../actions';

export async function hasPermission(client: Client<boolean>, userId: string) {
  const guild = await client.guilds.fetch(GUILD_ID);
  const member = await guild.members
    .fetch(userId)
    .then((member) => {
      return member;
    })
    .catch(() => {
      return null;
    });
  return member !== null ? member.roles.cache.hasAll(ROLE_ID) : false;
}

export async function shouldReturn(client: Client<boolean>, message: Message<boolean>) {
  const userHasPermission = await hasPermission(client, message.author.id);

  if (message.author.bot) return true;
  if (message.guild !== null && message.channel.id !== CHANNEL_ID) return true;
  if (message.guild === null && !userHasPermission) return true;
  if (message.content.startsWith('!')) return true;

  return false;
}

export async function checkPermissions(client: Client<boolean>, interaction: BaseInteraction): Promise<string | null> {
  if (!interaction.inGuild()) {
    return `**Error:** You don't have permission to do that. Try it in the channel <#${CHANNEL_ID}> instead.`;
  }

  const userHasPermission = await hasPermission(client, interaction.user.id);
  if (!userHasPermission) {
    return 'You do not have permission to use this.';
  }

  return null;
}

export async function createResponse(prompt: string, imageBuffers: Buffer[], buttonActions: Action[]): Promise<BaseMessageOptions> {
  const composite = await createTiledComposite(imageBuffers);
  const files = [new AttachmentBuilder(composite, { name: 'DALL-E.png' })];

  const embed = new EmbedBuilder().setImage('attachment://DALL-E.png').setColor('#2ee66b').setTitle('Here you go!').setDescription(prompt);

  const row = createRowFromActions(buttonActions, { count: imageBuffers.length });
  if (row) {
    return { embeds: [embed], files: files, components: [row] };
  }

  return { embeds: [embed], files: files, components: [] };
}

export function createRowFromActions(actions: Action[], context: CustomIdContext): ActionRowBuilder<ButtonBuilder> | null {
  if (actions.length === 0) {
    return null;
  }

  let row = new ActionRowBuilder<ButtonBuilder>();

  for (const action of actions) {
    const button = new ButtonBuilder().setCustomId(action.customId(context)).setLabel(action.displayText).setStyle(ButtonStyle.Secondary);

    row.addComponents(button);
  }

  return row;
}

export async function fetchImagesFromComposite(compositeImageData: EmbedImageData | null, count: number) {
  if (!compositeImageData || count == 0) {
    return null;
  }
  const width = compositeImageData.width;
  const height = compositeImageData.height;
  if (!width || !height) {
    return null;
  }

  try {
    const { data, status } = await axios.get(compositeImageData.url, {
      responseType: 'arraybuffer',
    });
    let compositeBuffer = Buffer.from(data);

    const images = await extractImagesFromComposite(compositeBuffer, width, height, count);
    return images;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function actionsFromRow(row: ActionRow<MessageActionRowComponent>): Action[] {
  var actions = [];
  for (const component of row.components) {
    const customId = component.customId;
    if (customId) {
      const action = Actions.find((c) => c.isAction(customId));
      if (action) {
        actions.push(action);
      }
    }
  }
  return actions;
}

export function rowFromActions(actions: Action[], context: CustomIdContext): ActionRowBuilder<ButtonBuilder> | null {
  if (actions.length == 0) {
    return null;
  }
  var row = new ActionRowBuilder<ButtonBuilder>();
  for (const action of actions) {
    const button = new ButtonBuilder().setCustomId(action.customId(context)).setLabel(action.displayText).setStyle(ButtonStyle.Secondary);
    row = row.addComponents(button);
  }
  return row;
}

export function handleOpenAIError(error: any, prompt: string): BaseMessageOptions {
  let result = {};

  const response = error.response;
  if (response) {
    if (response.status == 429) {
      result = {
        content: `**Something went wrong!** I am slightly overworked.😮‍💨 Please wait a few minutes and I\'ll be good to go!\n Your prompt was: ${prompt}`,
      };
    } else if (response.status >= 500 && response.status < 600) {
      result = {
        content: `**Something went wrong!** The server is experiencing issues. Please try again later.\n Your prompt was: ${prompt}`,
      };
    } else if (response.data && response.data.error) {
      // custom error keys from the openai api
      result = {
        content: `**Something went wrong!** ${response.data.error.message}  (${response.data.error.type}) \n Your prompt was: ${prompt}`,
      };
    } else {
      result = {
        content: `**Something went wrong!** ${response.statusText}  (${response.status}) \n Your prompt was: ${prompt}`,
      };
    }
  } else {
    result = {
      content: `**Something went wrong!** ${error} \n Your prompt was: ${prompt}`,
    };
  }

  return result;
}
