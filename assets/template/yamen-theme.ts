/**
 * 设计规范：取自参考信息图《明代县衙的权力结构》的纸本做旧风格。
 * 朱红=官，靛蓝=杂职官，橄榄绿=六房，金=点缀。
 */

export const colors = {
  paper: "#efe7d3",
  paperShade: "#e0d3b4",
  paperDeep: "#d8c9a6",
  ink: "#2b2317",
  inkSoft: "#5f5442",
  crimson: "#9b2d24",
  crimsonDark: "#7d211c",
  navy: "#21507c",
  navyDark: "#173a5c",
  olive: "#b39a4e",
  oliveDark: "#8b7533",
  gold: "#c9a227",
  line: "#c3b48d",
} as const;

export const fonts = {
  serif: '"Songti SC", "STSong", "SimSun", "Noto Serif SC", serif',
  serifBold: '"Songti SC Black", "STSongti-SC-Black", "SimHei", serif',
  kai: '"STKaiti", "KaiTi", "Kaiti SC", "Noto Serif SC", serif',
} as const;

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;
