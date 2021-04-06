import { ArgsOf, GuardFunction, Next } from "@typeit/discord";
import { Client } from "discord.js";
import { Student, Status } from "../../database/entity/Student";

const Authenticated: GuardFunction<"message"> = async (
    [message]: ArgsOf<"message">,
    client: Client,
    next: Next
) => {
    const student = await Student.findOne({
        user_id: message.author.id
    });

    if (student === undefined || student.status !== Status.COMPLETE) return;

    await next();
}

export default Authenticated;