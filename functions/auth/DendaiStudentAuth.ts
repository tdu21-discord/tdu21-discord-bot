import { ArgsOf, Guard, On } from "@typeit/discord";
import { Client, Guild, MessageEmbed, Role, User } from "discord.js";
import * as argon2 from "argon2";
import messages from "../../config/auth/directMessage";
import guildConfig from "../../config";
import { Status, Student } from "../../database/entity/Student";
import Authenticated from "../../guards/auth/Authenticated";
import Guest from "../../guards/auth/Guest";
import Unauthenticated from "../../guards/auth/Unauthenticated";
import DirectMessageOnly from "../../guards/DirectMessageOnlyGuard";
import { logger } from "../../utils/logger";
import { sendVerifyMail } from "../../utils/sendgrid";

export abstract class DendaiStudentAuth {
    @On("guildMemberAdd")
    @Guard(Guest)
    async joinNewStudent(
        [member]: ArgsOf<"guildMemberAdd">,
        client: Client
    ) {
        const student = new Student();

        try {
            student.user_id = member.user.id;
            await student.save();
        } catch (error) {
            logger.error(error);
            return;
        }

        this.sendDirectMessage(member.user, "join");

        logger.info(`[NEW_JOIN][${student.id}] ${member.user.username}(${member.user.id})`);
    }

    @On("guildMemberAdd")
    @Guard(Unauthenticated)
    joinUnauthStudent(
        [member]: ArgsOf<"guildMemberAdd">,
        client: Client,
        guardData: {
            student: Student
        }
    ) {
        const { student } = guardData;

        if (student.status === Status.NEW_JOIN) return;

        try {
            student.status = Status.RE_JOIN;
            student.verifycode = null;
            student.save();

            logger.info(`[RE_JOIN][${student.id}] ${member.user.username}(${member.user.id})`);
        } catch (error) {
            logger.error(error);
            return;
        }

        this.sendDirectMessage(member.user, "rejoin");
    }

    @On("guildMemberAdd")
    @Guard(Authenticated)
    joinAuthStudent(
        [member]: ArgsOf<"guildMemberAdd">,
        client: Client,
        guardData: {
            student: Student
        }
    ) {
        const { student } = guardData;

        this.setRole(
            member.guild,
            member.user,
            student.department,
            student.odd_even
        );

        this.sendDirectMessage(member.user, "join_auth");

        logger.info(`[COMPLETE][${student.id}] ${member.user.username}(${member.user.id})`);
    }

    @On("message")
    @Guard(
        DirectMessageOnly,
        Unauthenticated
    )
    async receiveStudentId(
        [directMessage]: ArgsOf<"message">,
        client: Client,
        guardData: {
            student: Student
        }
    ) {
        const { student } = guardData;
        const studentId = directMessage.content;

        if (student.status === Status.SENT_EMAIL) return;

        if (!this.validateStudentId(studentId)) {
            this.sendDirectMessage(directMessage.author, "error_student_id");
            return;
        }

        const hashedStudentId = await this.hashedStudentId(studentId);

        switch (student.status) {
            case Status.NEW_JOIN:

                const checkStudentId = await Student.findOne({
                    student_id: hashedStudentId
                });

                if (checkStudentId !== undefined) {
                    this.sendDirectMessage(directMessage.author, "error_student_id");
                    return;
                }

                const departmentId = studentId.substr(2, 2).toUpperCase();
                const oddEven = parseInt(studentId.substr(6)) % 2;

                try {
                    student.student_id = hashedStudentId;
                    student.department = departmentId;
                    student.odd_even = oddEven;

                    student.save();
                } catch (error) {
                    logger.error(error);
                    return;
                }

                break;

            case Status.RE_JOIN:

                if (!await argon2.verify(student.student_id, studentId)) {
                    this.sendDirectMessage(directMessage.author, "error_rejoin_student_id");
                    return;
                }

                break;
        }

        try {
            const verifyCode = this.generateVerifyCode();

            sendVerifyMail(studentId, verifyCode, directMessage.author.username);

            student.verifycode = verifyCode;
            student.status = Status.SENT_EMAIL;

            student.save();
        } catch (error) {
            logger.error(error);
            return;
        }

        this.sendDirectMessage(directMessage.author, "sent_email");

        logger.info(`[SENT_EMAIL][${student.id}] ${directMessage.author.username}(${directMessage.author.id})`);
    }

    @On("message")
    @Guard(
        DirectMessageOnly,
        Unauthenticated
    )
    verifyStudent(
        [directMessage]: ArgsOf<"message">,
        client: Client,
        guardData: {
            student: Student
        }
    ) {
        const { student } = guardData;
        const verifyCode = directMessage.content;

        if (student.status !== Status.SENT_EMAIL) return;

        if (this.validateStudentId(verifyCode)) return;

        if (student.threshold >= parseInt(process.env.STUDENT_ID_VERIFY_MAX)) {
            this.sendDirectMessage(directMessage.author, "error_threshold");
            return;
        }

        if (!/^\d{4}$/.test(verifyCode)) {
            this.sendDirectMessage(directMessage.author, "error_verify_code");
            return;
        }

        if (verifyCode !== student.verifycode) {
            try {
                student.threshold++;
                student.save();
            } catch (error) {
                logger.error(error);
                return;
            }

            this.sendDirectMessage(directMessage.author, "error_verify_code");
            return;
        }

        try {
            const guild = client.guilds.cache.find(
                (guild) => guild.id === guildConfig.guildId
            );

            this.setRole(
                guild,
                directMessage.author,
                student.department,
                student.odd_even
            );

            student.status = Status.COMPLETE;
            student.save();
        } catch (error) {
            logger.error(error);
            return;
        }

        this.sendDirectMessage(directMessage.author, "complete");

        logger.info(`[COMPLETE][${student.id}] ${directMessage.author.username}(${directMessage.author.id})`);
    }

    async sendDirectMessage(
        user: User,
        messageName: string
    ) {
        const messageDatum = messages.find(
            (message) => message.name === messageName
        );

        for (let message of messageDatum.body) {
            await user.send(message);
        }
    }

    async setRole(
        guild: Guild,
        user: User,
        departmentName: string,
        oddEven: number
    ) {
        const beAddedDep = guildConfig.departments.find(
            (department) => department.slug === departmentName.toUpperCase()
        );

        if (beAddedDep === undefined) return;

        const member = guild.member(user);

        const userRoles: Role[] = member.roles.cache.array();

        if (userRoles.find((role) => role.id === guildConfig.roles.member.roleId) !== undefined) return;

        await member.roles.add([
            await guild.roles.fetch(guildConfig.roles.member.roleId),
            await guild.roles.fetch(beAddedDep.facultyRoleId),
            await guild.roles.fetch(beAddedDep.departmentRoleId)
        ]);

        if (oddEven === 0) {
            await member.roles.add(
                await guild.roles.fetch(guildConfig.roles.evenNumber.roleId)
            );
        } else {
            await member.roles.add(
                await guild.roles.fetch(guildConfig.roles.oddNumber.roleId)
            );
        }
    }

    generateVerifyCode() {
        const numberTable = "0123456789";
        let verifyCode = "";

        for (let i = 0, k = numberTable.length; i < 4; i++) {
            verifyCode += numberTable.charAt(
                Math.floor(k * Math.random())
            );
        }

        return verifyCode;
    }

    async hashedStudentId(studentId: string) {
        return await argon2.hash(studentId, {
            hashLength: 50,
            timeCost: 4
        });
    }

    validateStudentId(studentId: string): boolean {
        return /21(AJ|AD|FA|FI|FR|EJ|EH|ES|EK|EF|EC|NE|NM|NC|RU|RB|RD|RM|RE|RG)[0-9]{3}$/i.test(studentId);
    }
}