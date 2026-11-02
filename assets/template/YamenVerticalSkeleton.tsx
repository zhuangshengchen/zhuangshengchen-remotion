/**
 * 起步骨架：纵向滚动官制谱系。
 * 拷进项目后改 TREE_STOPS 即可；所有节奏常量集中在「时间轴」区。
 */
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { colors, fonts } from "./yamen-theme";
import { TREE_STOPS, type TreeNode } from "./yamen-data";

const FPS = 30;
const PANO_OPEN = 2 * FPS;
const MOVE = 1.9 * FPS;
const HOLD = 3.2 * FPS;
const CHART = 9 * FPS;

const VIEW_HALF = 540;
const NODE_SPACING = 860;
const CANVAS_TOP = VIEW_HALF + 240;
const CANVAS_H = CANVAS_TOP + (TREE_STOPS.length - 1) * NODE_SPACING + 1200;
const stopY = (i: number) => CANVAS_TOP + i * NODE_SPACING;

const CAM_DRIFT = 62;
const arriveY = (i: number) => stopY(i) - VIEW_HALF - CAM_DRIFT;
const leaveY = (i: number) => stopY(i) - VIEW_HALF + CAM_DRIFT;

const holdOf = (n: TreeNode) => Math.round(HOLD);

const buildCamera = () => {
  const frames = [0, PANO_OPEN];
  const values = [arriveY(0), arriveY(0)];
  let t = PANO_OPEN;
  for (let i = 0; i < TREE_STOPS.length; i++) {
    t += holdOf(TREE_STOPS[i]);
    frames.push(t); values.push(leaveY(i));
    if (i < TREE_STOPS.length - 1) {
      t += MOVE;
      frames.push(t); values.push(arriveY(i + 1));
    }
  }
  return { frames, values, total: t };
};

const camera = buildCamera();
export const SKELETON_DURATION = camera.total + CHART;
const SCROLL_END = camera.total;

const stopStarts = () => {
  const out: number[] = [];
  let t = PANO_OPEN;
  for (let i = 0; i < TREE_STOPS.length; i++) {
    out.push(t);
    t += holdOf(TREE_STOPS[i]);
    if (i < TREE_STOPS.length - 1) t += MOVE;
  }
  return out;
};
const STARTS = stopStarts();

const GOLD = "#c9a227";
const GOLD_LIGHT = "#f0d68a";
const TEXT_SOFT = "rgba(255,248,220,0.70)";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const VChars: React.FC<{ text: string; fontSize: number; color: string }> = ({ text, fontSize, color }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontFamily: fonts.serifBold, fontSize, color, lineHeight: 1 }}>
    {[...text].map((ch, i) => (
      <div key={i} style={{ height: fontSize * 1.05, display: "flex", alignItems: "center", justifyContent: "center" }}>{ch}</div>
    ))}
  </div>
);

const Node: React.FC<{ node: TreeNode; y: number; active: boolean; localFrame: number }> = ({ node, y, active, localFrame }) => {
  const scale = active
    ? spring({ frame: localFrame, fps: FPS, config: { damping: 14, stiffness: 100, mass: 0.8 } })
    : 0.55;
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: "translate(-50%, -50%)" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 40,
        transform: `scale(${scale})`, transformOrigin: "center",
        opacity: active ? 1 : 0.4,
      }}>
        <div style={{ width: 120, height: 160, borderRadius: 8, background: colors.paperShade, border: `1px solid ${GOLD}` }} />
        <VChars text={node.label} fontSize={46} color={colors.crimson} />
      </div>
    </div>
  );
};

export const YamenVerticalSkeleton: React.FC = () => {
  const frame = useCurrentFrame();
  const camY = interpolate(frame, camera.frames, camera.values, CLAMP);
  const canvasOpacity = Math.min(
    interpolate(frame, [PANO_OPEN * 0.72, PANO_OPEN], [0, 1], CLAMP),
    interpolate(frame, [SCROLL_END - 10, SCROLL_END + 14], [1, 0], CLAMP),
  );
  const chartOpacity = interpolate(frame, [SCROLL_END + 4, SCROLL_END + 0.7 * FPS], [0, 1], CLAMP);
  const activeIdx = (() => {
    if (frame >= SCROLL_END || frame < PANO_OPEN) return -1;
    let idx = -1;
    STARTS.forEach((s, i) => { if (frame >= s) idx = i; });
    return idx;
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1410" }}>
      <Img src={staticFile("yamen/bg_silk.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.98) contrast(1.28) saturate(0.95)" }} />
      <AbsoluteFill style={{ background: "rgba(8,6,4,0.30)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(88% 78% at 50% 45%, transparent 0%, rgba(8,6,4,0.26) 62%, rgba(8,6,4,0.68) 100%)" }} />

      <div style={{ position: "absolute", top: 0, left: 0, width: 1920, height: CANVAS_H, translate: `0 ${-camY}px`, opacity: canvasOpacity }}>
        <svg width={1920} height={CANVAS_H} style={{ position: "absolute" }}>
          {TREE_STOPS.slice(1).map((_, i) => (
            <line key={i} x1={960} y1={stopY(i) + 60} x2={960} y2={stopY(i + 1) - 60} stroke={GOLD} strokeWidth={1.4} opacity={0.6} />
          ))}
        </svg>
        {TREE_STOPS.map((node, i) => (
          <Node key={node.id} node={node} y={stopY(i)} active={activeIdx === i} localFrame={frame - STARTS[i]} />
        ))}
      </div>

      <AbsoluteFill style={{ opacity: chartOpacity, alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: fonts.serifBold, fontSize: 54, color: GOLD_LIGHT }}>{TREE_STOPS[0]?.label ?? ""}</div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 44 }}>
        {activeIdx >= 0 && (
          <div style={{ fontFamily: fonts.serif, fontSize: 32, color: TEXT_SOFT, background: "rgba(10,8,5,0.55)", padding: "14px 34px", borderRadius: 8 }}>
            {TREE_STOPS[activeIdx].duty}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SKELETON_EASING = Easing.bezier(0.16, 1, 0.3, 1);
