---
name: zhuangshengchen-remotion
description: Build vertical-scrolling genealogy videos about Ming dynasty yamen officials with Remotion, with gold-on-silk styling, camera-scroll pacing, and vertical Chinese typography. Use when the user asks for 明代县衙官制谱系, 竖排谱系动画, or 官制结构视频. Do not use for unrelated Remotion edits.
---

# 明代县衙官制谱系视频

用 Remotion 生成「竖排滚动谱系 + 结尾全谱总览」结构的中国官制科普视频。整套方法来自已交付的 `YamenTreeVertical`（1920×1080 / 30fps / 约 113 秒）。

动手前先读：

- `references/visual-language.md` — 配色、字体、背景分层、星尘、光环、底座
- `references/timeline-and-camera.md` — 站点节拍、相机曲线、边界计算、总时长
- `references/code-patterns.md` — 可直接复用的组件与代码骨架

`assets/template/` 里是可以直接拷进项目的起步文件（主题令牌、内容数据、组件骨架）。

## 工作流程

1. **定内容数据**：把全部文案收进一个 `yamen-data.ts`，导出 `TITLE / INTRO / TREE_STOPS / SECURITY`。视频里任何文字都必须来自这里，禁止在组件里散落硬编码文案。
2. **定视觉令牌**：拷 `assets/template/yamen-theme.ts`，改 `colors` 与 `fonts`。字体必须带中文回退链（`"Songti SC", "STSong", "SimSun", serif`），否则 Linux 渲染会掉字。
3. **排时间轴**：按 `references/timeline-and-camera.md` 计算站点帧数、相机关键帧数组、`STOP_START_FRAMES`、`SCROLL_END`、`VERTICAL_DURATION`。**先把时长算完再写场景**，否则后期改节奏要重排所有动画。
4. **搭场景**：背景 → 连线 → 节点 → 聚焦层 → 字幕条，五层用 `AbsoluteFill` 叠放，按 `zIndex` 顺序渲染。
5. **收尾总览**：`SCROLL_END` 之后切到静态谱图，用 0.7s 淡入，与滚动段交叉淡出 10–14 帧。
6. **渲染验证**：按下方命令渲染，并抽首帧、每站、总览共 5 个以上时间点逐张看图，不要只看进度条。

## 渲染命令（macOS arm64）

```bash
export PATH="$HOME/.local/node/bin:$PATH"
export DYLD_LIBRARY_PATH=$PWD/node_modules/@remotion/compositor-darwin-arm64
npx tsc --noEmit
npx remotion render <CompositionId> out/<name>.mp4 --codec h264
```

抽帧检查：

```bash
./node_modules/@remotion/compositor-darwin-arm64/ffmpeg \
  -loglevel error -ss <秒> -i out/<name>.mp4 -frames:v 1 -y /tmp/check.jpg
```

`DYLD_LIBRARY_PATH` 缺失时渲染会报 compositor 加载失败；每次新终端都要重设。

## 硬性约束

- **竖排中文一律用逐字堆叠**（`VChars`），禁止 `writingMode: vertical-rl`。它在不同渲染后端方向不一致，曾把「长芦都转运盐使司」渲染成倒序。
- **CSS `transition` / `@keyframes` 不参与渲染**。所有运动必须由 `useCurrentFrame()` + `interpolate()` / `spring()` 逐帧计算。
- **每次渲染前先跑 `npx tsc --noEmit`**，类型错误不会阻止大部分渲染，但会在中途炸掉。
- **文字不能压住牌匾、立绘、光晕**。给每个文字块显式 `width` + `px` 定位，写完后按最宽的句子验算一遍。
- **一屏只留一个视觉重心**。聚焦某节点时，同屏其他节点降到 30% 透明度以下，不要平铺竞争。

## 交付验收

- 时长、分辨率、帧率与 `Root.tsx` 的 `Composition` 声明一致
- 每站停留 ≥ 3s，站点间移动 ≥ 1.8s，观众来得及读完底部字幕
- 首帧不是纯黑，尾帧不是硬切
- 所有竖排文字字形正确、顺序从上到下
- 抽帧图里没有裁切、溢出、重叠
- 输出目录只留最终版，中间版本随手删除

## 常见坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 某站永远不出现 | 步骤边界少算 | 边界数 = 场景数 + 1，逐站打印核对 |
| 节点文字超出画布 | 长地名 + 固定宽度 | 限制 `width`，`whiteSpace: nowrap` + 缩字号 |
| 渲染中途崩溃 | 类型错误 / 缺 `DYLD_LIBRARY_PATH` | 先 `tsc --noEmit` 再渲染 |
| 立绘边缘有黑边 | 抠图残留 | 用 `mask` 羽化，不要 `mix-blend-mode` |
| 相机停顿生硬 | 每站完全静止 | 加 `CAM_DRIFT`，停留时仍在缓慢下移 |
| 结尾总览突兀 | 直接切换 | 滚动段最后 10–14 帧淡出，总览 0.7s 淡入 |
