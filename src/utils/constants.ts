require('dotenv/config');

export const TOKEN: string = process.env.TOKEN!;

export const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY!;
export const OPENAI_MODEL_ID: string = process.env.OPENAI_MODEL_ID ?? 'gpt-3.5-turbo';
export const OPENAI_START_MESSAGE: string = process.env.OPENAI_START_MESSAGE ?? 'You are a friendly chatbot.';

export const CHANNEL_ID: string = process.env.CHANNEL_ID!;
export const GUILD_ID: string = process.env.GUILD_ID!;
export const ROLE_ID: string = process.env.ROLE_ID!;

if (!TOKEN) {
  throw 'TOKEN must be set in env';
}

if (!OPENAI_API_KEY) {
  throw 'OPENAI_API_KEY must be set in env';
}

if (!OPENAI_MODEL_ID) {
  throw 'OPENAI_MODEL_ID must be set in env';
}

if (!OPENAI_START_MESSAGE) {
  throw 'OPENAI_START_MESSAGE must be set in env';
}

if (!CHANNEL_ID) {
  throw 'CHANNEL_ID must be set in env';
}

if (!GUILD_ID) {
  throw 'GUILD_ID must be set in env';
}

if (!ROLE_ID) {
  throw 'ROLE_ID must be set in env';
}

export const MAX_IMAGES = 4; // the API supports 1 to 10 images per request
export const DEFAULT_IMAGES = 2; // This is used when no number is given
export const IMAGE_SIZE: number = 1024;
export const EXPAND_ACTION_PADDING = 120; // How many pixels the Expand action adds on each side
export const EXPAND_ACTION_NUM_IMAGES = 2; // how many images to show for an expand action
export const VARIATION_ACTION_NUM_IMAGES = 4; // how many images to show for an variation action

if (DEFAULT_IMAGES > MAX_IMAGES) {
  throw `DEFAULT_IMAGES must not be greater than MAX_IMAGES`;
}

if (![256, 512, 1024].includes(IMAGE_SIZE)) {
  throw `Invalid IMAGE_SIZE ${IMAGE_SIZE}`;
}
