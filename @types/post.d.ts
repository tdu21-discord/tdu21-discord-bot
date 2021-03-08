import { MessageEmbed } from "discord.js";

export interface Post {
  name: string;
  contents: PostSection[];
}

export interface PostSection {
  body: string | MessageEmbed;
  reactions?: string[];
}
