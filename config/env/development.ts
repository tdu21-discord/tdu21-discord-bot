import { Department } from "../../@types/department";
import { GuildConfig } from "../../@types/guildConfig";
import { ServerRoles } from "../../@types/serverRole";

const departments: Department[] = [
  {
    slug: "AJ",
    name: "システムデザイン工学部 情報システム工学科",
    departmentRoleId: "829696390217072648",
    facultyRoleId: "829696390217072649",
    emojiId: "796584431078342697",
    channelId: "829696390891962372",
  },
  {
    slug: "AD",
    name: "システムデザイン工学部 デザイン工学科",
    departmentRoleId: "829696390217072647",
    facultyRoleId: "829696390217072649",
    emojiId: "796584431229468772",
    channelId: "829696390891962373",
  },
  {
    slug: "FA",
    name: "未来科学部 建築学科",
    departmentRoleId: "829696390217072645",
    facultyRoleId: "829696390217072646",
    emojiId: "796584431312699413",
    channelId: "829696390891962376",
  },
  {
    slug: "FI",
    name: "未来科学部 情報メディア学科",
    departmentRoleId: "829696390217072644",
    facultyRoleId: "829696390217072646",
    emojiId: "796584431409168404",
    channelId: "829696390891962377",
  },
  {
    slug: "FR",
    name: "未来科学部 ロボット・メカトロニクス学科",
    departmentRoleId: "829696390217072643",
    facultyRoleId: "829696390217072646",
    emojiId: "796584431360016424",
    channelId: "829696391059079198",
  },
  {
    slug: "EJ",
    name: "工学部 電気電子工学科",
    departmentRoleId: "829696390217072641",
    facultyRoleId: "829696390217072642",
    emojiId: "796584431250046976",
    channelId: "829696391059079201",
  },
  {
    slug: "EH",
    name: "工学部 電子システム工学科",
    departmentRoleId: "829696390217072640",
    facultyRoleId: "829696390217072642",
    emojiId: "796584430902312971",
    channelId: "829696391059079202",
  },
  {
    slug: "ES",
    name: "工学部 応用化学科",
    departmentRoleId: "829696390182469651",
    facultyRoleId: "829696390217072642",
    emojiId: "796584431472607232",
    channelId: "829696391059079203",
  },
  {
    slug: "EK",
    name: "工学部 機械工学科",
    departmentRoleId: "829696390182469650",
    facultyRoleId: "829696390217072642",
    emojiId: "796584431149383741",
    channelId: "829696391059079204",
  },
  {
    slug: "EF",
    name: "工学部 先端機械工学科",
    departmentRoleId: "829696390182469649",
    facultyRoleId: "829696390217072642",
    emojiId: "796584431342321674",
    channelId: "829696391059079205",
  },
  {
    slug: "EC",
    name: "工学部 情報通信工学科",
    departmentRoleId: "829696390182469648",
    facultyRoleId: "829696390217072642",
    emojiId: "796584431154364446",
    channelId: "829696391059079206",
  },
  {
    slug: "NE",
    name: "工学部第二部 電気電子工学科",
    departmentRoleId: "829696390182469646",
    facultyRoleId: "829696390182469647",
    emojiId: "796584431422406676",
    channelId: "829696391223705671",
  },
  {
    slug: "NM",
    name: "工学部第二部 機械工学科",
    departmentRoleId: "829696390182469645",
    facultyRoleId: "829696390182469647",
    emojiId: "796584431536046080",
    channelId: "829696391223705672",
  },
  {
    slug: "NC",
    name: "工学部第二部 情報通信工学科",
    departmentRoleId: "829696390182469644",
    facultyRoleId: "829696390182469647",
    emojiId: "796584431594111017",
    channelId: "829696391223705673",
  },
  {
    slug: "RU",
    name: "理工学部 理学系",
    departmentRoleId: "829696390182469642",
    facultyRoleId: "829696390182469643",
    emojiId: "796584433783537736",
    channelId: "829696391223705676",
  },
  {
    slug: "RB",
    name: "理工学部 生命科学系",
    departmentRoleId: "829696390170542139",
    facultyRoleId: "829696390182469643",
    emojiId: "796584431599091743",
    channelId: "829696391223705677",
  },
  {
    slug: "RD",
    name: "理工学部 情報システムデザイン学系",
    departmentRoleId: "829696390170542138",
    facultyRoleId: "829696390182469643",
    emojiId: "796584431661482004",
    channelId: "829696391390953512",
  },
  {
    slug: "RM",
    name: "理工学部 機械工学系",
    departmentRoleId: "829696390170542137",
    facultyRoleId: "829696390182469643",
    emojiId: "796584432575709205",
    channelId: "829696391223705678",
  },
  {
    slug: "RE",
    name: "理工学部 電子工学系",
    departmentRoleId: "829696390170542136",
    facultyRoleId: "829696390182469643",
    emojiId: "796584431803957268",
    channelId: "829696391223705679",
  },
  {
    slug: "RG",
    name: "理工学部 建築・都市環境学系",
    departmentRoleId: "829696390170542135",
    facultyRoleId: "829696390182469643",
    emojiId: "796584431842099250",
    channelId: "829696391390953513",
  },
];

const roles: ServerRoles = {
  member: {
    name: "メンバー",
    roleId: "829696390233063494",
  },
  evenNumber: {
    name: "偶数",
    roleId: "829696390170542133",
  },
  oddNumber: {
    name: "奇数",
    roleId: "829696390170542134",
  }
}

const guildConfig: GuildConfig = {
  guildId: "829696390161629244",
  roles: roles,
  departments: departments
}

export default guildConfig