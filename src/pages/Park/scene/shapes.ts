import type { Building } from "@/data/bund";

/** 各形态的实际顶点高度（标签锚点用） */
export function labelTop(b: Building): number {
  const [w, h, d] = b.size;
  switch (b.shape) {
    case "dome":
      return h * 0.8 + h * 0.18 + w * 0.2 * 1.15;
    case "clock":
      return h * 0.55 + h * 0.45 + h * 0.16 + h * 0.06;
    case "globe":
      return h + d * 0.5 * 0.75 + d * 0.5;
    case "pyramid":
      return h * 0.82 + h * 0.28;
    case "jinmao":
      return h * 0.96 + h * 0.12;
    case "twist":
      // 标签挂在塔身上部，避免顶在画面边缘
      return h * 0.62;
    default:
      return h;
  }
}
