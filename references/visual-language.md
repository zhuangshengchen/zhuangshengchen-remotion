# 视觉语言

## 配色

纸本做旧基调：朱红代表官，靛蓝代表杂职官，橄榄绿代表六房，金色只做点缀。深色背景上正文用暖白，避免纯白。

```ts
export const colors = {
  paper: "#efe7d3", paperShade: "#e0d3b4", paperDeep: "#d8c9a6",
  ink: "#2b2317", inkSoft: "#5f5442",
  crimson: "#9b2d24", crimsonDark: "#7d211c",
  navy: "#21507c", navyDark: "#173a5c",
  olive: "#b39a4e", oliveDark: "#8b7533",
  gold: "#c9a227", line: "#c3b48d",
} as const;

export const fonts = {
  serif: '"Songti SC", "STSong", "SimSun", "Noto Serif SC", serif',
  serifBold: '"Songti SC Black", "STSongti-SC-Black", "SimHei", serif',
  kai: '"STKaiti", "KaiTi", "Kaiti SC", "Noto Serif SC", serif',
} as const;
```

深色场景额外用一组金色令牌：

```ts
const GOLD = "#c9a227";
const GOLD_LIGHT = "#f0d68a";
const GOLD_DIM = "rgba(201,162,39,0.55)";
const LINE_GOLD = "rgba(201,162,39,0.72)";
const LINE_DIM = "rgba(201,162,39,0.30)";
const TEXT_SOFT = "rgba(255,248,220,0.70)";
const TEXT_DIM = "rgba(255,248,220,0.42)";
const BG_SOIL = "#1a1410";
```

## 背景分层

自上而下五层，缺一层就会显得「贴纸感」：

1. 绢帛底图：`Img` 铺满 1920×1080，`scale: 1.15` 防止边缘露白，整片缓慢 `translate` 位移 60px
2. 轻度压暗：`rgba(8,6,4,0.30)`
3. 暗角：`radial-gradient(88% 78% at 50% 45%, transparent 0%, rgba(8,6,4,0.26) 62%, rgba(8,6,4,0.68) 100%)`
4. 金气：`radial-gradient(60% 50% at 50% 50%, transparent 60%, rgba(201,162,39,0.07) 100%)`
5. 星尘粒子

底图滤镜用 `brightness(0.98) contrast(1.28) saturate(0.95)`，不要糊、不要拉伸。

## 星尘

300 颗，位置用线性同余伪随机固定（不要用 `Math.random()`，否则每帧重排会闪烁）。每个粒子三个独立运动：

- 视差：`camY * 0.35` 跟相机走，制造纵深
- 漂浮：`sin(frame * 0.04 + phase) * 8`
- 闪烁：`0.45 + 0.55 * |sin(frame * 0.06 + phase)|`

## 焦点光环

34 条放射线，长短交替（偶数 0.7 宽，奇数 1.3 宽），用径向渐变的 `mask` 做外缘淡出。核心圆做 `sin(frame / 34)` 的呼吸，幅度控制在 0.26 以内，否则像呼吸灯。

## 底座

人物脚下椭圆投影：`radial-gradient(ellipse at center, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.30) 45%, transparent 76%)`，`blur(9px)`，高度为人物宽度的 0.42。

## 立绘

用 `mask` 羽化 PNG 边缘，禁止 `mix-blend-mode`（在视频编码里会产生色带）。立绘与文字分层：大立绘靠左（`LEFT_OFFSET = -340`），文字占右侧 60%。
