import { MessageTemplate } from "../../@types/messageTemplate";

const messages: MessageTemplate[] = [
    {
        name: "join",
        body: [
            {
                content: "__**TDU21 非公式Discordキャンパス へのご参加ありがとうございます！**__\n\n当サーバーで交流していただく前に、電大21期生かの確認のために**学籍番号の入力と学校メールアドレスでの認証**をお願いしております。\n次の手順に従って、認証をお願いします。",
            },
            {
                embed: {
                    title: "プライバシーについて",
                    description: "認証の過程で学籍番号の入力をお願いしておりますが、個人特定につながらないよう、**認証以外の目的では一切使用しない**ほか、ハッシュ化したうえで保存しており、**モデレーター側でも確認できないようになっています**のでご安心ください。\n\n詳しくは https://tdu21-discord.org/privacy-policy をご確認ください。",
                    color: 431075
                }
            },
            {
                embed: {
                    title: "分からないことがある / 問い合わせしたいときは",
                    description: "もし手順でわからないことがあったり、問い合わせが必要になった場合はこちらのページに記載されている手順でご連絡ください。\n→ https://tdu21-discord.org/support.html",
                    color: 431075
                }
            },
            {
                embed: {
                    title: "**Step1**/3 あなたの学籍番号を入力してください",
                    description: "このダイレクトメッセージに あなたの学籍番号( 例: `21ec999` ) を送信してください。\n学科の略称は大文字でも小文字でも構いません。",
                    color: 16562432
                }
            }
        ]
    },
    {
        name: "sent_email",
        body: [
            {
                embed: {
                    title: "**Step2**/3 認証番号を入力してください",
                    description: "あなたの学校メールアドレス( `[学籍番号]@ms.dendai.ac.jp` ) に**4桁の認証番号が書かれたメール**を送信しましたので、その番号を送信してください。",
                    color: 16562432,
                    fields: [
                        {
                            name: "Q. メールが来ないときは",
                            value: "有効期限はありませんので、後日メールが届いてからでも問題ありません。ご心配であればお問い合わせください。",
                            inline: false
                        },
                        {
                            name: "Q. 学籍番号を間違えて入れてしまったときは",
                            value: "手動での取り消しとなりますので、出来るだけ早くお問い合わせをお願いします。",
                            inline: false
                        }
                    ]
                }
            }
        ]
    },
    {
        name: "complete",
        body: [
            {
                embed: {
                    title: "**Step3**/3 認証完了！",
                    description: "認証番号が確認できましたので、**以上で学籍認証は完了**となります！ご協力ありがとうございました。\n\n元の画面に戻ると、話す場所(チャンネル)が見れるようになっていますので、**ぜひいろんな人と交流してみてください**！\n\n---\n\nDiscordを使うのが初めての方は https://tdu21-discord.org/guide.html もチェックしてみて下さい！",
                    color: 53380
                }
            }
        ]
    },
    {
        name: "rejoin",
        body: [
            {
                content:
                    "TDU21 非公式Discordキャンパス への再参加ありがとうございます！"
            },
            {
                embed: {
                    title: "プライバシーについて",
                    description: "認証の過程で学籍番号の入力をお願いしておりますが、個人特定につながらないよう、**認証以外の目的では一切使用しない**ほか、ハッシュ化したうえで保存しておりますので、**モデレーター側でも確認できないようになっています**のでご安心ください。\n\n詳しくは https://tdu21-discord.org/privacy-policy をご確認ください。",
                    color: 431075
                }
            },
            {
                embed: {
                    title: "分からないことがある / 問い合わせしたいときは",
                    description: "もし手順でわからないことがあったり、問い合わせが必要になった場合はこちらのページに記載されている手順でご連絡ください。\n→ https://tdu21-discord.org/support.html",
                    color: 431075
                }
            },
            {
                embed: {
                    title: "**Step1**/3 あなたの学籍番号を入力してください",
                    description: "以前にご入力いただいた情報を確認するため、このダイレクトメッセージに あなたの学籍番号( 例: `21ec999` ) を送信してください。\n学科の略称は大文字でも小文字でも構いません。",
                    color: 16562432
                }
            }
        ]
    },
    {
        name: "join_auth",
        body: [
            {
                content:
                    "TDU21 非公式Discordキャンパス への再参加ありがとうございます！"
            },
            {
                embed: {
                    title: "自動的に認証が完了しました",
                    description: "以前に学籍番号と学校メールアドレスによる確認が完了しているため、自動的に認証されてチャンネルが見れるようになりました。\n特に手順を踏んでいただく必要はございませんので、画面を戻っていただいて大丈夫です。",
                    color: 431075
                }
            }
        ]
    },
    {
        name: "error_student_id",
        body: [
            {
                embed: {
                    title: "エラー",
                    description: "入力していただいた学籍番号は受付できません。再度入力しなおしてください。",
                    color: 15406156,
                }
            }
        ]
    },
    {
        name: "error_rejoin_student_id",
        body: [
            {
                embed: {
                    title: "エラー",
                    description: "以前に入力いただいた学籍番号と異なっているため、入力していただいた学籍番号は受付できません。再度入力しなおしてください。",
                    color: 15406156,
                    fields: [
                        {
                            name: "Q. 学籍番号を間違えて入れてしまったときは",
                            value: "手動での取り消しとなりますので、お問い合わせをお願いします。",
                            inline: false
                        }
                    ]
                }
            }
        ]
    },
    {
        name: "error_threshold",
        body: [
            {
                embed: {
                    title: "エラー",
                    description: "あなたのアカウントは認証試行回数の上限に達しています。手動による対応が必要ですので、下記ページを確認していただきお問い合わせをお願いいたします\n\nhttps://tdu21-discord.org/support.html",
                    color: 15406156,
                }
            }
        ]
    },
    {
        name: "error_verify_code",
        body: [
            {
                embed: {
                    title: "エラー",
                    description: "認証番号が一致しませんでした。入力内容をご確認の上、再度お試しください。",
                    color: 15406156,
                }
            }
        ]
    }
];

export default messages;