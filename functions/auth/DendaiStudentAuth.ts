import { ArgsOf, Guard, On } from "@typeit/discord";
import { Client, MessageEmbed, User } from "discord.js";
import messages from "../../config/auth/directMessage";
import Guest from "../../guards/auth/Guest";
import DirectMessageOnly from "../../guards/DirectMessageOnlyGuard";

export abstract class DendaiStudentAuth {
    // サーバー参加
    @On("guildMemberAdd")
    async onGuildMemberAdd(
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

    // 学籍番号の入力
    @On("message")
    @Guard(
        DirectMessageOnly,
        Guest
    )
    async receiveStudentId(
        [directMessage]: ArgsOf<"message">,
        client: Client
    ) {
        // メンバーIDがDB上に存在し、ステータスが `NEW_JOIN` の場合のみ以下を処理する

        // 学籍番号を正規表現で検証し、マッチしなければエラーを吐く

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
        Guest
    )
    async verifyCode(
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

    // サーバー脱退
    @On("guildMemberRemove")
    async onGuildMemberRemove(
        [member]: ArgsOf<"guildMemberRemove">,
        client: Client
    ) {
        // メンバーに関する情報を抹消
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
}