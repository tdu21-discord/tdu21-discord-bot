import { ArgsOf, GuardFunction, Next } from "@typeit/discord";
import { Client, Guild, GuildMember, Message } from "discord.js";
import { Student } from "../../database/entity/Student";

const Guest: GuardFunction<"message" | "guildMemberAdd"> = async (
    [payload]: ArgsOf<"message" | "guildMemberAdd">,
    client: Client,
    next: Next
) => {
    const isBot = () => {
        if (payload instanceof Message) {
            return payload.author.bot;
        } else if (payload instanceof GuildMember) {
            return payload.user.bot;
        }
    }

    if (isBot()) return;

    const userId = () => {
        if (payload instanceof Message) {
            return payload.author.id;
        } else if (payload instanceof GuildMember) {
            return payload.user.id;
        }
    }

    const student = await Student.findOne({
        user_id: userId()
    });

    if (student !== undefined) return;

    await next();
}

export default Guest;