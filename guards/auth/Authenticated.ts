import { ArgsOf, GuardFunction, Next } from "@typeit/discord";
import { Client, GuildMember, Message } from "discord.js";
import { Student, Status } from "../../database/entity/Student";

const Authenticated: GuardFunction<"message" | "guildMemberAdd"> = async (
    [payload]: ArgsOf<"message" | "guildMemberAdd">,
    client: Client,
    next: Next,
    guardData: {
        student: Student
    }
) => {
    const userId = () => {
        if (payload instanceof Message) {
            return payload.author.id;
        } else if (payload instanceof GuildMember) {
            return payload.user.id;
        }
    }

    guardData.student = await Student.findOne({
        user_id: userId()
    });

    if (guardData.student === undefined || guardData.student.status !== Status.COMPLETE) return;

    await next();
}

export default Authenticated;