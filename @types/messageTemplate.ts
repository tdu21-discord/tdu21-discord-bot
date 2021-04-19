import { MessageOptions } from "discord.js";

export interface MessageTemplate {
  name: string;
  body: MessageOptions[];
}

export interface ServerMessageTemplate extends MessageTemplate {
  reactions: string[];
}