import { CatmullRomCurve3, Vector3 } from "three";

/**
 * 把多边形路线的拐角处理成圆角，生成闭合曲线。
 * 圆角半径按相邻边长自动缩小；长直边上插入等距控制点，避免 Catmull-Rom 曲线在长边上外凸。
 */
export function makeLoopCurve(points: [number, number][], radius = 1.4, spacing = 3) {
  const n = points.length;
  const corners: { enter: Vector3; exit: Vector3 }[] = [];
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const cur = points[i];
    const next = points[(i + 1) % n];
    const toPrev = new Vector3(prev[0] - cur[0], 0, prev[1] - cur[1]);
    const toNext = new Vector3(next[0] - cur[0], 0, next[1] - cur[1]);
    const r = Math.min(radius, toPrev.length() * 0.4, toNext.length() * 0.4);
    corners.push({
      enter: new Vector3(cur[0], 0, cur[1]).addScaledVector(toPrev.normalize(), r),
      exit: new Vector3(cur[0], 0, cur[1]).addScaledVector(toNext.normalize(), r),
    });
  }

  const pts: Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const a = corners[i].exit;
    const b = corners[(i + 1) % n].enter;
    pts.push(corners[i].enter, a);
    const len = a.distanceTo(b);
    const steps = Math.floor(len / spacing);
    for (let k = 1; k < steps; k++) {
      pts.push(new Vector3().lerpVectors(a, b, k / steps));
    }
  }
  return new CatmullRomCurve3(pts, true, "centripetal");
}
