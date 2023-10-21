import { Client, ChatInputCommandInteraction, CacheType, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../command";
import { DEFAULT_IMAGES, MAX_IMAGES } from "../utils/constants";
import { createImage, imagesFromBase64Response } from "../utils/openai";
import { createResponse } from "../utils/discord";

export const Imagine: Command = {
    name: "imagine",
    description: "Generates images with DALL-E.",
    type: ApplicationCommandType.ChatInput,
    options: [{ 
        name: "prompt", 
        description: "Describe the image you want to generate.", 
        type: ApplicationCommandOptionType.String, 
        required: true
    }, {
        name: "n",
        description: `Number of images to generate. Default is ${DEFAULT_IMAGES}. Maximum is ${MAX_IMAGES}.`	,
        type: ApplicationCommandOptionType.Integer,
        minValue: 1,
        maxValue: MAX_IMAGES,
        required: false
    }],
    run: async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>) => {
        const uuid = interaction.user.id;
        const prompt = interaction.options.getString("prompt");
        const count = interaction.options.getInteger("n") ?? DEFAULT_IMAGES;

        if (prompt == null) {
            await interaction.reply("Prompt must exist.");
            return;
        }
      
        await interaction.deferReply();

        try {
            const completion = await createImage(prompt, count);
            const images = imagesFromBase64Response(completion);
            const response = await createResponse(prompt, images);
            interaction
                .followUp({ ...response, content: `<@${uuid}>` })
                .catch(console.error);
        } catch (error) {
            console.log(error);
        }
    },
};