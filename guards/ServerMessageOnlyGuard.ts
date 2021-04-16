import { ArgsOf, GuardFunction, Next } from "@typeit/discord";
import { Client, MessageEmbed } from "discord.js";

const ServerMessageOnly: GuardFunction<"message"> = async (
    [message]: ArgsOf<"message">,
    client: Client,
    next: Next
) => {
    if (message.channel.type !== "text" || message.author.bot) {
        message.author.send({embed:
            new MessageEmbed()
                .setColor("#F24D24")
                .setTitle("このコマンドを実行する権限がありません。")
                .setDescription("このコマンドはサーバーでのみ実行可能です")
        });

        return;
    }

    await next();
}

export default ServerMessageOnly;