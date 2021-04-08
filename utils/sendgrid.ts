import * as sendgrid from "@sendgrid/mail";

import { logger } from "./logger";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerifyMail = (
    studentId: string,
    verifyCode: string
) => {
    const studentEmail = studentId.toLowerCase() + "@" + process.env.DENDAI_EMAIL_DOMAIN;

    const message = {
        to: studentEmail,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: process.env.SENDGRID_FROM_NAME
        },
        subject: "【認証コード】TDU21 Discordキャンパス 学籍認証に関するお知らせ",
        text: "認証コード: %verifyCode%",
        substitutions: {
            verifyCode: verifyCode
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