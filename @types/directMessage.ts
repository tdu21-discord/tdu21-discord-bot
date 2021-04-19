import { MessageEmbed } from "discord.js";

export interface Message {
    name: string;
    contents: MessageSection[];
}

export interface MessageSection {
    body: string | MessageEmbed;
}