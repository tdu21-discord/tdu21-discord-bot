import { optionalChannel } from "../@types/optionalChannel";

type channelConfig = {
  channelId: string;
  channelName?: string;
  targetRoles: optionalChannel[];
};

const optionalChannels: channelConfig[] = [
  {
    channelId: "797476460709412895",
    channelName: "3号館エントランス",
    targetRoles: [
      {
        roleId: "797639166808293447",
        name: "音楽",
        emojiId: "1F3B5",
      },
      {
        roleId: "797639466864476192",
        name: "プログラミング",
        emojiId: "2328 FE0F",
      },
      {
        roleId: "797639470983151646",
        name: "イラスト",
        emojiId: "1F58C FE0F",
      },
      {
        roleId: "797639473344282634",
        name: "VR",
        emojiId: "1F97D",
      },
      {
        roleId: "797639474980192257",
        name: "パソコン",
        emojiId: "1F5A5 FE0F",
      },
      {
        roleId: "797639477287714866",
        name: "サイクリング",
        emojiId: "1F6B2",
      },
      {
        roleId: "797645140151894086",
        name: "アウトドア",
        emojiId: "1F5FB",
      },
    ],
  },
  {
    channelId: "797476492485459989",
    channelName: "9号館エントランス",
    targetRoles: [
      {
        roleId: "798162057589555230",
        name: "えっっ",
        emojiId: "1F51E",
      },
      {
        roleId: "798161861199265842",
        name: "JK科",
        emojiId: "796595265125089321",
      },
    ],
  },
];

export default optionalChannels;
