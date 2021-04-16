import { MessageOptions } from "discord.js";

export interface MessageTemplate {
  name: string;
  body: MessageOptions[]
}