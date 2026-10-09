import { BackSide } from "three";
import { theme } from "@/theme";
import { SkyMaterial } from "./materials";

/** 天幕：地平线一圈霞光，向天顶渐暗，让天际线有"晕"进夜空的感觉 */
export default function Sky() {
  return (
    <mesh raycast={() => null}>
      <sphereGeometry args={[450, 24, 12]} />
      <SkyMaterial side={BackSide} depthWrite={false} uHorizon="#1b1744" uZenith={theme.bg} />
    </mesh>
  );
}
