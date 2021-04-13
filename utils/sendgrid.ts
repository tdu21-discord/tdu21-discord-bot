import * as sendgrid from "@sendgrid/mail";
import emails from "../config/auth/email";

import { logger } from "./logger";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerifyMail = (
    studentId: string,
    verifyCode: string,
    discordUsername: string
) => {
    const studentEmail = studentId.toLowerCase() + "@" + process.env.DENDAI_EMAIL_DOMAIN;

    const messageDatum = emails.find(
        (email) => email.name === "verify"
    );

    const message = {
        to: studentEmail,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: process.env.SENDGRID_FROM_NAME
        },
        subject: messageDatum.subject,
        text: messageDatum.body,
        substitutions: {
            verifyCode: verifyCode,
            discordUsername: discordUsername
        },
        substitutionWrappers: [
            "%", "%"
        ]
    };

    try {
        sendgrid.send(message);
    } catch (error) {
        logger.error("Failed to send the following email... \n TO: " + studentEmail)
    }
}