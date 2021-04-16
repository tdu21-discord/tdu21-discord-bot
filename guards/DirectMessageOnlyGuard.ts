import { ArgsOf, GuardFunction, Next } from "@typeit/discord";
import { Client } from "discord.js";

const DirectMessageOnly: GuardFunction<"message"> = async (
    [message]: ArgsOf<"message">,
    client: Client,
    next: Next
) => {
    if (message.channel.type !== "dm" || message.author.bot) return;

    await next();
}

export default DirectMessageOnly;