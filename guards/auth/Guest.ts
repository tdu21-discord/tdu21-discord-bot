import { GuardFunction, Next } from "@typeit/discord";
import { Client } from "discord.js";
import { Student } from "../../database/entity/Student";

const Guest: GuardFunction<"message" | "guildMemberAdd"> = async (
    [payload]: any,
    client: Client,
    next: Next
) => {
    const isBot = () => {
        if (payload.constructor.name === "Message") {
            return payload.author.bot;
        } else if (payload.constructor.name === "GuildMember") {
            return payload.user.bot;
        }
    }

    if (isBot()) return;

    const userId = () => {
        if (payload.constructor.name === "Message") {
            return payload.author.id;
        } else if (payload.constructor.name === "GuildMember") {
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