import { ButtonInteraction, Client } from 'discord.js';

export interface CustomIdContext {
  count: number;
}

export interface Action {
  displayText: string;
  isAction: (customId: string) => boolean;
  customId: (context: CustomIdContext) => string;
  run: (client: Client, interaction: ButtonInteraction) => void;
}
