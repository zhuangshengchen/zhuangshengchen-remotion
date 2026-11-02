/**
 * 内容取自用户提供的信息图《明代县衙的权力结构》。
 * 视频的文案与层级结构的唯一数据源。
 */

export const TITLE = "明代县衙的权力结构";

export const INTRO =
  "县衙中的人员分为官、吏、役三等，呈金字塔形。在政务上的分工大体为：官主决策，吏理文书，役供差遣。";

export const INTRO_DETAIL =
  "知县、县丞、主簿、典史为朝廷命官，数量极少。知县总掌一县之政务，佐贰、首领官分别分工负责劝农、水利、清军、巡缉等某一方面的事务。";

/** 正官与佐贰官（金字塔顶层） */
export const TOP_OFFICIALS = [
  { name: "知县", rank: "正七品", duty: "总掌一县之政务" },
  { name: "县丞", rank: "正八品", duty: "佐贰官，分掌粮马、征税、户籍、巡捕" },
  { name: "主簿", rank: "正九品", duty: "佐贰官，分掌粮马、户籍、巡捕" },
  { name: "典史", rank: "未入流", duty: "首领官，掌文移出入、缉捕、狱囚" },
];

/** 幕友（师爷）——非朝廷命官，由知县自聘 */
export const PRIVATE_SECRETARIES = {
  name: "幕友",
  alias: "师爷",
  roles: ["章奏", "书禀", "征比", "刑名", "钱谷", "挂号"],
};

/** 六房——各房由吏员、书算主事 */
export const SIX_ROOMS = {
  note: "各房由吏员、书算主事",
  rooms: ["承发房", "架阁库", "吏房", "户房", "礼房", "兵房", "刑房", "工房"],
  summary: "六房",
};

/** 各种役——衙门里地位最低 */
export const CORVEE = {
  note: "各种役，衙门里地位最低",
  threeShifts: {
    name: "三班",
    members: [
      { name: "皂班", detail: "供皂隶之差" },
      { name: "快班", detail: "马快、步快" },
      { name: "捕班", detail: "由快班分出，合称“捕快”" },
      { name: "壮班", detail: "民壮" },
    ],
  },
  prison: ["监狱乐（禁子）", "门子"],
  others: ["弓兵", "仵作", "伞夫", "锣鼓夫"],
};

/** 杂职官——一县的各种职能机构 */
export const FUNCTIONAL_OFFICES = {
  note: "杂职官 · 一县的各种职能机构",
  offices: [
    { name: "巡检司", officer: "巡检", rank: "从九品" },
    { name: "税课司", officer: "大使", rank: "从九品" },
    { name: "水马驿", officer: "驿丞", rank: "未入流" },
    { name: "急递铺", officer: "铺兵", rank: "未入流" },
    { name: "道会司", officer: "道会", rank: "未入流" },
    { name: "僧会司", officer: "僧会", rank: "未入流" },
    { name: "阴阳学", officer: "训术", rank: "未入流" },
    { name: "医学", officer: "训科", rank: "未入流" },
    { name: "县学", officer: "教谕、训导", rank: "未入流" },
    { name: "批验所", officer: "大使", rank: "未入流" },
    { name: "铁冶所", officer: "大使", rank: "未入流" },
    { name: "仓", officer: "大使", rank: "未入流" },
    { name: "库", officer: "大使", rank: "未入流" },
    { name: "河泊所", officer: "河泊所官", rank: "未入流" },
    { name: "闸官 · 坝官", officer: "闸官 · 坝官", rank: "未入流" },
    { name: "递运所", officer: "大使", rank: "未入流" },
  ],
};

/** 基层组织：厢、坊与乡—都—图—甲 */
export const LOCAL_ORDER = {
  note: "基层组织",
  quote:
    "凡置之都城内者，曰坊；置之都城外者，曰厢；远于城者，曰乡。 —— 《江宁府志》",
  market: [
    { name: "厢", head: "厢主" },
    { name: "坊", head: "坊主" },
  ],
  chain: ["乡", "都", "图", "甲"],
  li: { name: "里", chain: ["里长", "甲首"] },
  jia: { name: "甲", chain: ["总甲", "小甲", "火夫"] },
  fireNote: "火甲，明代以里为单位的基层治安组织。",
};

/** 结尾：明代一县的治安力量 */
export const SECURITY = {
  title: "明代一县的治安力量",
  points: [
    "由典史或佐贰官担任巡捕官，督率县衙中弓兵、捕快，负责抓捕盗贼。",
    "壮班中的民壮，是地方民兵，防御城池，剿灭叛匪。由典史或佐贰官一员管领。",
    "由巡检司弓兵与地方火甲共同承担县城外某一地方的治安。",
  ],
};
