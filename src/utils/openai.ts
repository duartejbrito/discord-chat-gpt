import OpenAI from 'openai';
import { IMAGE_SIZE, OPENAI_API_KEY, OPENAI_MODEL_ID, OPENAI_START_MESSAGE } from './constants';
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from 'openai/resources/chat';
import { logMessage } from '.';
import { ImagesResponse } from 'openai/resources';

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY, // This is also the default, can be omitted
});

export function startConversionLog(): ChatCompletionMessageParam[] {
  return [{ role: 'system', content: OPENAI_START_MESSAGE }];
}

export function createChatCompletion(conversationLog: ChatCompletionMessageParam[]) {
  return openai.chat.completions
    .create({
      model: OPENAI_MODEL_ID,
      messages: conversationLog,
    } as ChatCompletionCreateParamsNonStreaming)
    .catch((error) => {
      logMessage(`ERR: ${error}`);
    });
}

function sizeEnum(): '256x256' | '512x512' | '1024x1024' {
  if (IMAGE_SIZE == 256) {
    return '256x256';
  }
  if (IMAGE_SIZE == 512) {
    return '512x512';
  }
  if (IMAGE_SIZE == 1024) {
    return '1024x1024';
  }
  throw 'Invalid IMAGE_SIZE';
}

export const OPENAI_API_SIZE_ARG = sizeEnum();

export function createImage(prompt: string, numImages: number) {
  return openai.images.generate({
    prompt: prompt,
    n: numImages,
    response_format: 'b64_json',
    size: OPENAI_API_SIZE_ARG,
  });
}

export function imagesFromBase64Response(response: ImagesResponse): Buffer[] {
  const data = response.data;
  const resultData: string[] = data.map((d) => d.b64_json) as string[];
  return resultData.map((j) => Buffer.from(j, 'base64'));
}
