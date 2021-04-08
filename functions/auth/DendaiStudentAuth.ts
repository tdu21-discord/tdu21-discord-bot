import { ArgsOf, Guard, On } from "@typeit/discord";
import { Client, MessageEmbed, User } from "discord.js";
import messages from "../../config/auth/directMessage";
import { Student } from "../../database/entity/Student";
import Authenticated from "../../guards/auth/Authenticated";
import Guest from "../../guards/auth/Guest";
import Unauthenticated from "../../guards/auth/Unauthenticated";
import DirectMessageOnly from "../../guards/DirectMessageOnlyGuard";
import { sendVerifyMail } from "../../utils/sendgrid";

export abstract class DendaiStudentAuth {
    // サーバー参加 (ゲスト)
    @On("guildMemberAdd")
    @Guard(Guest)
    async newJoinStudent(
        [member]: ArgsOf<"guildMemberAdd">,
        client: Client
    ) {
        // メンバーのIDがDB上に存在しないかチェックし、存在すればステータスを確認する

        // ステータスが `NEW_JOIN` であれば、レコード作成をスキップする
        // ステータスが `SENT_EMAIL` であれば、確認コードを再発行認証用メールを再送信してレコードの作成と認証に関するDMの送信をスキップ
        // ステータスが `COMPLETE` であれば、自動認証しメンバーにロールを付与する

        // メンバーのIDを元にレコードを作成 (ユーザーID, ステータス)

        // メールアドレス認証に関するDMを送信
    }

    // サーバー参加 (未認証)
    @On("guildMemberAdd")
    @Guard(Unauthenticated)
    async joinUnauthStudent(
        [member]: ArgsOf<"guildMemberAdd">,
        client: Client
    ) {

    }

    // サーバー参加 (認証済み)
    @On("guildMemberAdd")
    @Guard(Authenticated)
    async joinAuthStudent(
        [member]: ArgsOf<"guildMemberAdd">,
        client: Client
    ) {

    }

    // 学籍番号の入力
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

        // メンバーIDがDB上に存在し、ステータスが `NEW_JOIN` の場合のみ以下を処理する
        if (student.status !== "NEW_JOIN") return;

        // 学籍番号を正規表現で検証し、マッチしなければエラーを吐く
        if (!/21(AJ|AD|FA|FI|FR|EJ|EH|ES|EK|EF|EC|NE|NM|NC|RU|RB|RD|RM|RE|RG)[0-9]{3}$/i.test(studentId)) {
            await this.sendDirectMessage(directMessage.author, "error_student_id");
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
    async verifyStudent(
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

    // ダイレクトメッセージを送信する
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

    // ロールを付与する
    async setRole(
        user: User,
        department: string,
        oddEven: number
    ) {
        //
    }
}