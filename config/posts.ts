import { MessageEmbed } from "discord.js";
import { Post } from "../@types/post";

const posts: Post[] = [
  {
    name: "学科設定",
    contents: [
      {
        body:
          "🏫 **__学科設定__** 🏫\n\n学科を選択すると、全体チャンネルと自分の学部・学科のチャンネルが表示されます。\n選択した時点でルールに同意したものとみなします。\n基本的に後から変更はできませんので、間違えないように注意してください。\nㅤ\n",
      },
      {
        body: new MessageEmbed()
          .setColor("#164F9E")
          .setFooter("▼ 学科設定ボタンはこちら ▼")
          .addFields(
            {
              name: "**システムデザイン工学部**",
              value:
                "<:aj:796584431078342697> 情報システム工学科 (AJ科)\n<:ad:796584431229468772> デザイン工学科 (AD科)",
            },
            {
              name: "**未来科学部**",
              value:
                "<:fa:796584431312699413> 建築学科(FA科)\n<:fi:796584431409168404> 情報メディア学科 (FI科)\n<:fr:796584431360016424> ロボット・メカトロニクス学科 (FR科)",
            },
            {
              name: "**工学部**",
              value:
                "<:ej:796584431250046976> 電気電子工学科 (EJ科)\n<:eh:796584430902312971> 電子システム工学科 (EH科)\n<:es:796584431472607232> 応用化学科 (ES科)\n<:ek:796584431149383741> 機械工学科 (EK科)\n<:ef:796584431342321674> 先端機械工学科 (EF科)\n<:ec:796584431154364446> 情報通信工学科 (EC科)",
            },
            {
              name: "**工学部第二部**",
              value:
                "<:ne:796584431422406676> 電気電子工学科 (NE科)\n<:nm:796584431536046080> 機械工学科 (NM科)\n<:nc:796584431594111017> 情報通信工学科 (NC科)",
            },
            {
              name: "**理工学部**",
              value:
                "<:ru:796584433783537736> 理学系 (RU科)\n<:rb:796584431599091743> 生命科学系 (RB科)\n<:rd:796584431661482004> 情報システムデザイン学系 (RD科)\n<:rm:796584432575709205> 機械工学系 (RM科)\n<:re:796584431803957268> 電子工学系 (RE科)\n<:rg:796584431842099250> 建築・都市環境学系 (RG科)",
            }
          ),
        reactions: [
          "796584431078342697",
          "796584431229468772",
          "796584431312699413",
          "796584431409168404",
          "796584431360016424",
          "796584431250046976",
          "796584430902312971",
          "796584431472607232",
          "796584431149383741",
          "796584431342321674",
          "796584431154364446",
          "796584431422406676",
          "796584431536046080",
          "796584431594111017",
          "796584433783537736",
          "796584431599091743",
          "796584431661482004",
          "796584432575709205",
          "796584431803957268",
          "796584431842099250",
        ],
      },
    ],
  },
  {
    name: "キャンパスガイド",
    contents: [
      {
        body:
          "https://tdu21-discord.org/img/tdu21_discord_general-banner.png",
      },
      {
        body:
          "ㅤ\n <:tdu21_circle:796573992650670140>  __** TDU21 非公式Discordキャンパス へようこそ！**__ <:tdu21_circle:796573992650670140>\n\n本キャンパスは、東京電機大学 21期生の交流を目的として有志が運営しています。\n直接キャンパスに行くことが難しいこの状況下において、学科内・学科を超えたコミュニケーション等に活用していただければと思います。\n\n-----",
      },
      {
        body:
          "ㅤ\n🚨 __**注意事項**__ 🚨\n\n「TDU21 非公式Discordキャンパス」は有志が管理しており、__**東京電機大学に公式に認められたものではありません**__。\n本グループに関わる問い合わせを東京電機大学に行わないでください。\n\n-----",
      },
      {
        body:
          "ㅤ\n📄  __**ルール等について**__  📄\n\n当サーバーにおけるルール等、文面で残しておくものは**すべてWebサイト上に掲載しています**。\n\n▼ チェックはこちらから ▼\n<https://tdu21-discord.org/about.html>\n\n-----",
      },
      {
        body:
          "ㅤ\n🔧  __**参加後の設定について**__  🔧\n\n参加後、学科設定をすると話す場所が見えるようになります。\n\n▼ 設定方法 ▼\n<https://tdu21-discord.org/guide.html>\n\n-----",
      },
    ],
  },
];

export default posts;
