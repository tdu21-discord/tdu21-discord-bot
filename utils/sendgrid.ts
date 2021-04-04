import * as sendgrid from "@sendgrid/mail";
import { Message } from "discord.js";
import { logger } from "./logger";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = (
    studentId: string,
    subject: string,
    text: string
) => {
    const studentEmail = studentId.toLowerCase() + "@" + process.env.DENDAI_EMAIL_DOMAIN;

    const message = {
        to: studentEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject,
        text
    };

    try {
        sendgrid.send(message);
    } catch (error) {
        logger.error("Failed to send the following email... \n TO: " +  studentEmail  + "\n SUBJECT: " + subject)
    }
}