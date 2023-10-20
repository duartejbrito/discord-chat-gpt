import * as config from "./config.json";
require('dotenv/config');

export const TOKEN: string = process.env.TOKEN ?? config.TOKEN;

export const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY ?? config.OPENAI_API_KEY;
export const OPENAI_MODEL_ID: string = process.env.OPENAI_MODEL_ID ?? config.OPENAI_MODEL_ID;
export const OPENAI_START_MESSAGE: string = process.env.OPENAI_START_MESSAGE ?? config.OPENAI_START_MESSAGE;

export const CHANNEL_ID: string = process.env.CHANNEL_ID ?? config.CHANNEL_ID;
export const GUILD_ID: string = process.env.GUILD_ID ?? config.GUILD_ID;
export const ROLE_ID: string = process.env.ROLE_ID ?? config.ROLE_ID;

if (!TOKEN) {
    throw "TOKEN must be set in env or config";
}

if (!OPENAI_API_KEY) {
    throw "OPENAI_API_KEY must be set in env or config";
}

if (!OPENAI_MODEL_ID) {
    throw "OPENAI_MODEL_ID must be set in env or config";
}

if (!OPENAI_START_MESSAGE) {
    throw "OPENAI_START_MESSAGE must be set in env or config";
}

if (!CHANNEL_ID) {
    throw "CHANNEL_ID must be set in env or config";
}

if (!GUILD_ID) {
    throw "GUILD_ID must be set in env or config";
}

if (!ROLE_ID) {
    throw "ROLE_ID must be set in env or config";
}