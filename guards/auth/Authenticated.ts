import { ArgsOf, GuardFunction, Next } from "@typeit/discord";
import { Client, GuildMember, Message } from "discord.js";
import { Student, Status } from "../../database/entity/Student";

const Authenticated: GuardFunction<"message" | "guildMemberAdd"> = async (
    [payload]: ArgsOf<"message" | "guildMemberAdd">,
    client: Client,
    next: Next
) => {
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

    if (student === undefined || student.status !== Status.COMPLETE) return;

    await next();
}

export default Authenticated;