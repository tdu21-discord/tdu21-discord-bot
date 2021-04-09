import { ArgsOf, Guard, On } from "@typeit/discord";
import { Client, Guild, MessageEmbed, Role, User } from "discord.js";
import messages from "../../config/auth/directMessage";
import departments from "../../config/departments";
import { Student } from "../../database/entity/Student";
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

        if (student.status === "NEW_JOIN") {
            this.sendDirectMessage(member.user, "join");
            logger.info(`[RE_JOIN] ${member.user.username}(${member.user.id}) joined the serber`);
            return;
        }

        const verifyCode = this.generateVerifyCode();

        try {
            student.verifycode = verifyCode;
            student.save();

            sendVerifyMail(student.student_id, verifyCode);
        } catch (error) {
            logger.error(error);
        }

        // 再発行通知
        this.sendDirectMessage(member.user, "join_unauth");

        logger.info(`[RE_JOIN] Regenerate verifyCode and resend email... ${member.user.username}(${member.user.id})`)
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

        // 認証済み通知
        this.sendDirectMessage(member.user, "join_auth");

        logger.info(`[RE_JOIN] Set Role... ${member.user.username}(${member.user.id})`);
    }

    // 学籍番号の入力
    @On("message")
    @Guard(
        DirectMessageOnly,
        Unauthenticated
    )
    receiveStudentId(
        [directMessage]: ArgsOf<"message">,
        client: Client,
        guardData: {
            student: Student
        }
    ) {
        const { student } = guardData;
        const studentId = directMessage.content;

        if (student.status !== "NEW_JOIN") return;

        if (!/21(AJ|AD|FA|FI|FR|EJ|EH|ES|EK|EF|EC|NE|NM|NC|RU|RB|RD|RM|RE|RG)[0-9]{3}$/i.test(studentId)) {
            this.sendDirectMessage(directMessage.author, "error_student_id");
            return;
        }

        // 学籍番号をハッシュ化して、メンバーテーブルに同じ値がないか検証する

        // メンバーテーブルに同じ値があればエラーを吐く、同じ値がなければハッシュ化した学籍番号をレコードに格納する

        // 学籍番号を 21 + 〇〇 + XXX で分け、学科記号と学籍番号下1桁が奇数であるか偶数であるかをレコードに格納する

        // 6桁のランダムな認証番号を生成し、レコードに格納する

        // 学校メールアドレスに認証番号を送信

        // ステータスを `SENT_EMAIL` に変更する
    }

    // 認証番号の検証
    @On("message")
    @Guard(
        DirectMessageOnly,
        Unauthenticated
    )
    verifyStudent(
        [directMessage]: ArgsOf<"message">,
        client: Client
    ) {
        // メンバーIDがDB上に存在し、ステータスが `SENT_EMAIL` の場合のみ以下を処理する

        // 認証番号の検証における試行回数が閾値を超えていたら、モデレーターに連絡するようにDMを送信する

        // 送られてきたメッセージがすべて数字かつ6桁であるかを正規表現で検証する

        // メンバーIDから認証番号を取得し検証を行う

        // 認証に成功したら、DB に保存されている学科記号と奇数 or 偶数の情報を用いてロールを付与する

        // 認証に失敗したら、試行回数をインクリメントしてエラーを吐く

        // ステータスを `COMPLETE` に変更する

        // 認証成功に関するDMを送信
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
}