import { ButtonInteraction, ChatInputCommandInteraction, Client, CommandInteraction, Events, Interaction } from "discord.js";
import { Commands } from "../commands";
import { checkPermissions } from "../utils/discord";

export default (client: Client): void => {
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        try {
            if (interaction.isCommand() || interaction.isContextMenuCommand()) {
                await handleSlashCommand(client, interaction);
            } else if (interaction.isButton()) {
                await handleButtonAction(client, interaction);
            }
        } catch (error) {
            console.log(error);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const permissionCheckResult = await checkPermissions(client, interaction);
    if (permissionCheckResult) {
        await interaction
            .reply({ content: permissionCheckResult, ephemeral: true })
            .catch(console.error);
        return;
    }

    const slashCommand = Commands.find((c) => c.name === interaction.commandName);
    if (!slashCommand) {
      await interaction.reply({ content: "Missing command." });
      return;
    }
  
    if (!(interaction instanceof ChatInputCommandInteraction)) {
      interaction.reply({ content: "You do not have permission to use this." });
      return;
    }
  
    slashCommand.run(client, interaction);
};

const handleButtonAction = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
    throw new Error("Not implemented");
};