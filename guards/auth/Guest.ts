import { ArgsOf, GuardFunction, Next } from "@typeit/discord";
import { Client } from "discord.js";
import { Student } from "../../database/entity/Student";

const Guest: GuardFunction<"message"> = async (
    [message]: ArgsOf<"message">,
    client: Client,
    next: Next
) => {
    const student = await Student.findOne({
        user_id: message.author.id
    });

    if (student !== undefined) return;

    await next();
}

export default Guest;