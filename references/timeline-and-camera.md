# 时间轴与相机

## 节拍常量

先把所有节奏写成秒，再统一转帧。改节奏只改这几个常量。

```ts
const FPS = 30;
const PANO_SECONDS = { open: 2, close: 2 };
const SINGLE_HOLD_SECONDS = 3.2;   // 单人站停留
const GROUP_OPEN_SECONDS = 0.5;    // 群组展开
const MEMBER_STAY_SECONDS = 2.2;   // 群组内每位成员聚焦
const MOVE_SECONDS = 1.9;          // 站间移动
const CHART_SECONDS = 9;           // 结尾总览
```

群组站的停留 = `groupOpen + members * memberStay`，由节点类型自动算：

```ts
const focusCount = (node: TreeNode) => (node.members?.length ?? 0) > 1 ? node.members!.length : 1;
const stopHoldFrames = (node: TreeNode) =>
  node.kind === "group"
    ? Math.round((GROUP_OPEN_SECONDS + focusCount(node) * MEMBER_STAY_SECONDS) * FPS)
    : Math.round(SINGLE_HOLD_SECONDS * FPS);
```

## 画布坐标

节点纵向等距排列，画布总高由节点数推出，不要手写。

```ts
const VIEW_H = 1080;
const VIEW_HALF = VIEW_H * 0.5;
const NODE_SPACING = 860;
const CANVAS_TOP = VIEW_HALF + 240;
const CANVAS_BOTTOM = CANVAS_TOP + (TREE_STOPS.length - 1) * NODE_SPACING;
const CANVAS_H = CANVAS_BOTTOM + 1200;
const stopY = (i: number) => CANVAS_TOP + i * NODE_SPACING;
```

## 相机

关键点：镜头永不静止。每站到达时停在上方 `CAM_DRIFT`，离开时在下方 `CAM_DRIFT`，站间用 `interpolate` 的多段关键帧驱动。

```ts
const CAM_DRIFT = 62;
const camArriveY = (i: number) => stopY(i) - VIEW_HALF - CAM_DRIFT;
const camLeaveY = (i: number) => stopY(i) - VIEW_HALF + CAM_DRIFT;

const buildCameraScroll = () => {
  const frames: number[] = [];
  const values: number[] = [];
  frames.push(0); values.push(camArriveY(0));
  frames.push(panoOpenFrames); values.push(camArriveY(0));
  let t = panoOpenFrames;
  for (let i = 0; i < TREE_STOPS.length; i++) {
    const holdEnd = t + stopHoldFrames(TREE_STOPS[i]);
    frames.push(holdEnd); values.push(camLeaveY(i));
    t = holdEnd;
    if (i < TREE_STOPS.length - 1) {
      const moveEnd = t + moveFrames;
      frames.push(moveEnd); values.push(camArriveY(i + 1));
      t = moveEnd;
    }
  }
  return { frames, values, total: t };
};
```

渲染时：`interpolate(frame, CAMERA_FRAMES, CAMERA_VALUES, CLAMP)`，再给画布 `translate: 0 ${-camY}px`。

## 站点边界

边界必须比站点多一个。少算就会有一站永远不出现。

```ts
const computeStopStartFrames = () => {
  const starts: number[] = [];
  let t = panoOpenFrames;
  for (let i = 0; i < TREE_STOPS.length; i++) {
    starts.push(t);
    t += stopHoldFrames(TREE_STOPS[i]);
    if (i < TREE_STOPS.length - 1) t += moveFrames;
  }
  return starts;
};
const STOP_START_FRAMES = computeStopStartFrames();

const currentStopIndex = (frame: number) => {
  if (frame < panoOpenFrames) return -1;
  for (let i = 0; i < TREE_STOPS.length; i++) {
    const start = STOP_START_FRAMES[i];
    const end = start + stopHoldFrames(TREE_STOPS[i]) + (i < TREE_STOPS.length - 1 ? moveFrames : 0);
    if (frame >= start && frame < end) return i;
  }
  return TREE_STOPS.length - 1;
};
```

## 总时长

```ts
export const SCROLL_END = SCROLL_TOTAL;
export const VERTICAL_DURATION = SCROLL_TOTAL + chartFrames;
```

`Root.tsx` 里的 `durationInFrames` 直接用 `VERTICAL_DURATION`，不要在注册处再手写数字。

## 段间过渡

- 开场：`0 → 0.4s` 标题淡入，`panoOpen - 0.4s → panoOpen` 淡出
- 画布淡入：`panoOpen * 0.72 → panoOpen`
- 画布淡出：`SCROLL_END - 10 → SCROLL_END + 14`
- 总览淡入：`SCROLL_END + 4 → SCROLL_END + 0.7 * fps`
- 收尾缩放：`SCROLL_END - panoClose → SCROLL_END`，`1 → 0.94`，缓动 `Easing.bezier(0.16, 1, 0.3, 1)`

所有 `interpolate` 都要带 `extrapolateLeft/Right: "clamp"`，否则首尾两帧会飞出画布。
