import { CanvasTexture, SRGBColorSpace } from "three";

let radial: CanvasTexture | null = null;

/** 径向渐变贴图（灯光光晕 / 地面光斑），运行时生成，无需素材文件 */
export function getRadialTexture() {
  if (radial) return radial;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.4)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  radial = new CanvasTexture(canvas);
  radial.colorSpace = SRGBColorSpace;
  return radial;
}
