import OpenAI from "openai";
import { OPENAI_API_KEY, OPENAI_MODEL_ID, OPENAI_START_MESSAGE } from "./constants";
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/resources/chat";
import { logMessage } from ".";

export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY // This is also the default, can be omitted
});

export function startConversionLog(): ChatCompletionMessageParam[] {
    return [{ role: 'system', content: OPENAI_START_MESSAGE }];
}

export function createChatCompletion(conversationLog: ChatCompletionMessageParam[]) {
    return openai.chat.completions.create({
        model: OPENAI_MODEL_ID,
        messages: conversationLog,
    } as ChatCompletionCreateParamsNonStreaming)
    .catch((error) => {
        logMessage(`ERR: ${error}`);
    });
}