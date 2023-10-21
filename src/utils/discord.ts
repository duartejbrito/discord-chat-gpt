import { AttachmentBuilder, BaseInteraction, BaseMessageOptions, Client, EmbedBuilder, Message } from "discord.js";
import { CHANNEL_ID, GUILD_ID, ROLE_ID } from "./constants";
import { createTiledComposite } from "./image";

export async function hasPermission(client: Client<boolean>, userId: string) {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(userId)
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
    const userHasPermission = await hasPermission(client, interaction.user.id);
    if (!userHasPermission) {
        return "You do not have permission to use this.";
    }

    return null;
}

export async function createResponse(prompt: string, imageBuffers: Buffer[]): Promise<BaseMessageOptions> {
    const composite = await createTiledComposite(imageBuffers);
    const files = [
        new AttachmentBuilder(composite, { name: "DALL-E.png" }),
    ];

    const embed = new EmbedBuilder()
        .setImage("attachment://DALL-E.png")
        .setColor("#2ee66b")
        .setTitle("Here you go!")
        .setDescription(prompt);

    return { embeds: [embed], files: files, components: [] };
}