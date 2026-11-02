# 可复用代码骨架

## 竖排中文（关键）

`writingMode` 在 Chromium / 渲染后端方向不一致，只能用逐字堆叠。字号行高必须显式，否则 `line-height` 会吃掉上下留白。

```tsx
const VChars: React.FC<{
  text: string; fontSize: number; color: string; bold?: boolean; letterSpacing?: number;
}> = ({ text, fontSize, color, bold = true, letterSpacing = 0 }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    fontFamily: bold ? fonts.serifBold : fonts.serif,
    fontSize, color, lineHeight: 1,
  }}>
    {[...text].map((ch, i) => (
      <div key={i} style={{
        height: fontSize * 1.05 + letterSpacing,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{ch}</div>
    ))}
  </div>
);
```

横排牌匾则相反：`flexDirection: "row"`，逐字渲染，字距固定，不要依赖 `letter-spacing` 做居中。

## 星尘

```tsx
const PARTICLE_COUNT = 300;
const PARTICLE_SEEDS: { x: number; y: number; r: number; s: number; phase: number }[] = [];
{
  let h = 12345;
  const rand = () => { h = (h * 9301 + 49297) % 233280; return h / 233280; };
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    PARTICLE_SEEDS.push({
      x: rand() * 100, y: rand() * 100, r: rand() * 2.2 + 0.4,
      s: rand() * 0.6 + 0.3, phase: rand() * Math.PI * 2,
    });
  }
}

const StarDust: React.FC<{ camY: number }> = ({ camY }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {PARTICLE_SEEDS.map((p, i) => {
        const baseY = (p.y / 100) * CANVAS_H + camY * 0.35;
        const floatY = Math.sin(frame * 0.04 + p.phase) * 8;
        const floatX = Math.cos(frame * 0.03 + p.phase * 1.3) * 4;
        const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.06 + p.phase));
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${p.x}%`,
            top: baseY + floatY,
            translate: `${floatX}px 0`,
            width: p.r * 2, height: p.r * 2, borderRadius: "50%",
            background: GOLD_LIGHT,
            opacity: twinkle * p.s,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
```

## 聚焦弹簧

```tsx
const springScale = spring({
  frame: localFrame,          // 相对本站起点，不能用全局 frame
  fps: 30,
  config: { damping: 14, stiffness: 100, mass: 0.8 },
});
```

`localFrame = globalFrame - nodeStartFrame` 是唯一正确做法；直接用全局帧会让后面所有站点的动画一开始就处于完成态。

## 群组成员聚焦

同屏多人时，用「每个成员的聚焦进度 p」统一驱动位移与缩放：

```tsx
const EASE_FOCUS = Easing.bezier(0.42, 0, 0.22, 1);
const FOCUS_RAMP = 15;                       // 帧数，聚焦过渡
const focusScale = 280 / BM_W;               // 聚焦统一放大到 280px 宽，与人数无关
const memberFocusP = (i: number) =>
  interpolate(localFrame, [rampStart, rampStart + FOCUS_RAMP], [0, 1], { ...CLAMP, easing: EASE_FOCUS });
```

关键点：所有成员共用同一个缩放目标值，只位移不同；否则人多时会大小不一。

## 结尾谱图

谱图不要用布局引擎排版，直接写坐标数组，人肉对齐最快也最稳。

```ts
type ChartTone = "red" | "navy" | "olive" | "gray" | "plain";

const TONE_FILL: Record<ChartTone, [string, string]> = {
  red: ["#8f2b22", "#5f1a14"],
  navy: ["#26567f", "#16395a"],
  olive: ["#8a7736", "#5f5122"],
  gray: ["#5d564c", "#3b362f"],
  plain: ["rgba(22,17,12,0.88)", "rgba(12,9,7,0.88)"],
};

const chartRow = (
  labels: string[], subs: string[], tone: ChartTone,
  startX: number, step: number, y: number, w: number, h: number, fs = 24,
) => labels.map((label, i) => ({ label, sub: subs[i], tone, x: startX + i * step, y, w, h, fs }));
```

单元格内文字用 `VChars` 竖排，`sub` 用小字号横排放置在格底。谱图整体 `opacity` 由 `chartP` 驱动淡入。

## 接线

谱系连线用 `svg` 的 `path`，颜色 `LINE_GOLD` / `LINE_DIM` 区分主次，线宽 1–2px，转折点加 2px 小圆点。连线要对齐节点中心的绝对坐标，不要靠 CSS 边距推算。

## 叙述字幕条

底部字幕条宽 1200–1500px，居中，字号 30–34px，颜色 `TEXT_SOFT`，背景 `rgba(10,8,5,0.55)` 加 8px 圆角。字幕换行最多两行，超出就砍字，不要缩字号。
