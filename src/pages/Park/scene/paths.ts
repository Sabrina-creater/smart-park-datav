import { CatmullRomCurve3, Vector3 } from "three";

/**
 * 把多边形路线的拐角处理成圆角，生成闭合曲线。
 * 圆角半径会按相邻边长自动缩小，短边（如双向车道的掉头段）也能正确转弯。
 */
export function makeLoopCurve(points: [number, number][], radius = 1.4) {
  const pts: Vector3[] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const cur = points[i];
    const next = points[(i + 1) % n];
    const toPrev = new Vector3(prev[0] - cur[0], 0, prev[1] - cur[1]);
    const toNext = new Vector3(next[0] - cur[0], 0, next[1] - cur[1]);
    const r = Math.min(radius, toPrev.length() * 0.4, toNext.length() * 0.4);
    pts.push(new Vector3(cur[0], 0, cur[1]).addScaledVector(toPrev.normalize(), r));
    pts.push(new Vector3(cur[0], 0, cur[1]).addScaledVector(toNext.normalize(), r));
  }
  return new CatmullRomCurve3(pts, true, "centripetal");
}
