import { ApplicationCommandType, ChatInputCommandInteraction, Client, Colors, EmbedBuilder } from "discord.js";
import { Command } from "../command";

export const Ping: Command = {
    name: 'ping',
    description: 'Replies with Pong!',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        let ping = client.ws.ping;

        let embed_1 = new EmbedBuilder()
            .setAuthor({ name: client.user!.username, iconURL: client.user!.displayAvatarURL() })
            .setDescription(`Hey ${interaction.user}, my ping is \`checking...\`.`)
            .setColor(Colors.Yellow);

        let embed_2 = new EmbedBuilder()
            .setAuthor({ name: client.user!.username, iconURL: client.user!.displayAvatarURL() })
            .setDescription(`Hey ${interaction.user}, my ping is \`${ping}ms\`.`)
            .setColor(Colors.Green);

        interaction.reply({ embeds: [embed_1] }).then(() => {
            setTimeout( () => {
                interaction.editReply({ embeds: [embed_2] })
            }, 2000)
        });
    }
};