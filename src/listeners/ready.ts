import { Client, Events } from "discord.js";
import { logMessage } from "../utils";
import { CHANNEL_ID, GUILD_ID, OPENAI_API_KEY, OPENAI_MODEL_ID, OPENAI_START_MESSAGE, ROLE_ID, TOKEN } from "../utils/constants";
import { Commands } from "../commands";

export default (client: Client): void => {
    client.on(Events.ClientReady, async () => {
        if (!client.user || !client.application) {
            return;
        }
        await client.application.commands.set(Commands);

        logMessage(`${client.user.username} is ready!`);
        logMessage('==================================== CONTEXT ============================================');
        logMessage(`OpenAi API Key: ${OPENAI_API_KEY}`);
        logMessage(`OpenAi Model ID: ${OPENAI_MODEL_ID}`);
        logMessage(`OpenAi Start Message: ${OPENAI_START_MESSAGE}`);
        logMessage('=========================================================================================');
        logMessage(`Discord Token: ${TOKEN}`);
        logMessage(`Channel ID: ${CHANNEL_ID}`);
        logMessage(`Guild ID: ${GUILD_ID}`);
        logMessage(`Role ID: ${ROLE_ID}`);
        logMessage('=========================================================================================');
    });
};