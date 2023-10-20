import { Client, Message } from "discord.js";
import { CHANNEL_ID, GUILD_ID, ROLE_ID } from "./constants";

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