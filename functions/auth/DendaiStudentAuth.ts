import { ArgsOf, Guard, On } from "@typeit/discord";
import { Client, Guild, MessageEmbed, Role, User } from "discord.js";
import * as bcrypt from "bcrypt";
import messages from "../../config/auth/directMessage";
import departments from "../../config/departments";
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
    joinNewStudent(
        [member]: ArgsOf<"guildMemberAdd">,
        client: Client
    ) {
        try {
            const student = new Student();

            student.user_id = member.user.id;
            student.save();
        } catch (error) {
            logger.error(error);
            return;
        }

        this.sendDirectMessage(member.user, "join");

        logger.info(`[NEW_JOIN] ${member.user.username}(${member.user.id}) joined the server`);
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

        if (student.status === Status.NEW_JOIN) {
            this.sendDirectMessage(member.user, "join");
            logger.info(`[RE_JOIN] ${member.user.username}(${member.user.id}) joined the server`);
            return;
        }

        try {
            student.status = Status.RE_JOIN;
            student.verifycode = null;

            student.save();
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

        logger.info(`[RE_JOIN] Set Role... ${member.user.username}(${member.user.id})`);
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

        const hashedStudentId = this.hashedStudentId(studentId);

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

                if (!bcrypt.compareSync(studentId, student.student_id)) {
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

        if (student.threshold > parseInt(process.env.STUDENT_ID_VERIFY_MAX)) {
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
                (guild) => guild.id === ""
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
    }

    async sendDirectMessage(
        user: User,
        messageName: string
    ) {
        const messageDatum = messages.find(
            (message) => message.name === messageName
        );

        for (let message of messageDatum.contents) {
            const getSendObject = (body: string | MessageEmbed) =>
                body instanceof MessageEmbed ? { embed: body } : body;

            await user.send(getSendObject(message.body));
        }
    }

    async setRole(
        guild: Guild,
        user: User,
        departmentName: string,
        oddEven: number
    ) {
        const beAddedDep = departments.find(
            (department) => department.slug === departmentName.toUpperCase()
        );

        if (beAddedDep === undefined) return;

        const member = guild.member(user);

        const userRoles: Role[] = member.roles.cache.array();

        // メンバーロールの ID
        if (userRoles.find((role) => role.id === "") !== undefined) return;

        member.roles.add([
            await guild.roles.fetch(""),
            await guild.roles.fetch(beAddedDep.departmentRoleId)
        ]);

        // 偶数 or 奇数ロールの ID
        if (oddEven === 0) {
            member.roles.add(
                await guild.roles.fetch("")
            );
        } else {
            member.roles.add(
                await guild.roles.fetch("")
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

    hashedStudentId(studentId: string): string {
        return bcrypt.hashSync(studentId, 10);
    }

    validateStudentId(studentId: string): boolean {
        return /21(AJ|AD|FA|FI|FR|EJ|EH|ES|EK|EF|EC|NE|NM|NC|RU|RB|RD|RM|RE|RG)[0-9]{3}$/i.test(studentId);
    }
}