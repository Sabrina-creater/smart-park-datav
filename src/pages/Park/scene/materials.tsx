import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { Color } from "three";

/**
 * 楼宇材质：底部→顶部渐变 + 程序化窗户 + 自下而上的扫光带 + 悬停高亮
 * 适用于方体 / 柱体等有明显立面的几何体
 */
export const BuildingMaterial = extend(
  shaderMaterial(
    {
      uTime: 0,
      uHeight: 1,
      uSeed: 0,
      uOpacity: 1,
      uHighlight: 0,
      uBottom: new Color("#0a2448"),
      uTop: new Color("#2f8de0"),
      uScan: new Color("#8fd3ff"),
      uWindow: new Color("#d9f3ff"),
      uFlood: 0,
      uStripe: 0,
    },
    /* glsl */ `
      varying vec3 vPos;
      varying vec3 vNormal;

      void main() {
        vPos = position;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    /* glsl */ `
      uniform float uTime;
      uniform float uHeight;
      uniform float uSeed;
      uniform float uOpacity;
      uniform float uHighlight;
      uniform vec3 uBottom;
      uniform vec3 uTop;
      uniform vec3 uScan;
      uniform vec3 uWindow;
      uniform float uFlood;
      uniform float uStripe;

      varying vec3 vPos;
      varying vec3 vNormal;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main() {
        float h = clamp((vPos.y + uHeight * 0.5) / uHeight, 0.0, 1.0);
        vec3 col = mix(uBottom, uTop, pow(h, 1.3));

        // 侧面窗户
        float side = 1.0 - abs(vNormal.y);
        vec2 wc = abs(vNormal.x) > 0.5 ? vec2(vPos.z, vPos.y) : vec2(vPos.x, vPos.y);
        vec2 density = vec2(1.7, 1.5);
        vec2 cellId = floor(wc * density);
        vec2 cell = fract(wc * density);
        float wx = smoothstep(0.18, 0.3, cell.x) * (1.0 - smoothstep(0.7, 0.82, cell.x));
        float wy = smoothstep(0.2, 0.32, cell.y) * (1.0 - smoothstep(0.62, 0.74, cell.y));
        float win = wx * wy * side * step(0.03, h) * step(h, 0.95);
        float lit = step(0.5, hash(cellId + uSeed + floor(uTime * 0.12) * 0.37));
        col += uWindow * win * (0.18 + 0.55 * lit) * (1.0 - 0.45 * uFlood);

        // 泛光照明：檐口发光 + 立面柱廊竖向亮纹
        float cornice = smoothstep(0.86, 0.95, h) * (1.0 - step(0.985, h));
        col += uScan * cornice * 0.9 * uFlood;
        float pil = 1.0 - smoothstep(0.0, 0.06, abs(fract(wc.x * 0.5) - 0.5) - 0.44);
        col += uScan * pil * side * 0.18 * uFlood * (1.0 - h);

        // 螺旋灯带（上海中心）
        float ang = atan(vPos.z, vPos.x) / 6.2831853;
        float sp = fract(h * 7.0 - ang + uTime * 0.04);
        float stripe = smoothstep(0.0, 0.04, sp) * (1.0 - smoothstep(0.07, 0.12, sp));
        col += uScan * stripe * uStripe * 0.9 * side;

        // 扫光带
        float band = 0.12;
        float p = fract(uTime * 0.18 + uSeed) * (1.0 + 2.0 * band) - band;
        float scan = 1.0 - smoothstep(0.0, band, abs(h - p));
        col += uScan * scan * 0.75;

        // 顶面
        if (vNormal.y > 0.5) {
          col = mix(uTop, uScan, 0.4 + 0.4 * uFlood);
        }

        col += uScan * uHighlight * 0.45;

        gl_FragColor = vec4(col, uOpacity);
      }
    `
  )
);

/**
 * 地标材质：渐变 + 扫光 + 边缘辉光（菲涅尔），不画窗户
 * 适用于球体、穹顶、尖顶等曲面构件
 */
export const LandmarkMaterial = extend(
  shaderMaterial(
    {
      uTime: 0,
      uHeight: 1,
      uSeed: 0,
      uOpacity: 1,
      uHighlight: 0,
      uBottom: new Color("#4a1060"),
      uTop: new Color("#ff4fd8"),
      uScan: new Color("#ffb3f0"),
    },
    /* glsl */ `
      varying vec3 vPos;
      varying vec3 vWorldNormal;
      varying vec3 vViewDir;

      void main() {
        vPos = position;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    /* glsl */ `
      uniform float uTime;
      uniform float uHeight;
      uniform float uSeed;
      uniform float uOpacity;
      uniform float uHighlight;
      uniform vec3 uBottom;
      uniform vec3 uTop;
      uniform vec3 uScan;

      varying vec3 vPos;
      varying vec3 vWorldNormal;
      varying vec3 vViewDir;

      void main() {
        float h = clamp((vPos.y + uHeight * 0.5) / uHeight, 0.0, 1.0);
        vec3 col = mix(uBottom, uTop, h);

        float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0), 2.5);
        col += uScan * fresnel * 0.9;

        float band = 0.14;
        float p = fract(uTime * 0.18 + uSeed) * (1.0 + 2.0 * band) - band;
        float scan = 1.0 - smoothstep(0.0, band, abs(h - p));
        col += uScan * scan * 0.6;

        col += uScan * uHighlight * 0.45;

        gl_FragColor = vec4(col, uOpacity);
      }
    `
  )
);

/** 光束材质：水平发光核心 + 两端淡出 */
export const BeamMaterial = extend(
  shaderMaterial(
    { uColor: new Color("#8fc2ff"), uOpacity: 1 },
    /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;

      void main() {
        float strength = 1.0 - abs(vUv.x - 0.5) * 2.0;
        strength = pow(strength, 2.0);
        float verticalFade = pow(sin(vUv.y * 3.14159), 0.5);
        float brightness = strength * verticalFade;
        gl_FragColor = vec4(uColor * brightness * 2.0, brightness * uOpacity);
      }
    `
  )
);

/** 江面波光材质：流动的亮斑叠加在反射水面上 */
export const RippleMaterial = extend(
  shaderMaterial(
    {
      uTime: 0,
      uColor: new Color("#5ad8ff"),
      uOpacity: 0.35,
      uScale: 1,
    },
    /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    /* glsl */ `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uScale;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 p = vUv * uScale;
        float n = noise(p * 6.0 + vec2(uTime * 0.25, uTime * 0.08));
        n += 0.5 * noise(p * 14.0 - vec2(uTime * 0.18, uTime * 0.3));
        n /= 1.5;
        float glint = smoothstep(0.62, 0.9, n);
        // 边缘淡出，避免硬边
        float edge = smoothstep(0.0, 0.08, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y));
        gl_FragColor = vec4(uColor, glint * uOpacity * edge);
      }
    `
  )
);

/** LED 巨幕材质：像素网格 + 流动色带 + 扫描线 */
export const LedMaterial = extend(
  shaderMaterial(
    { uTime: 0, uSeed: 0, uOpacity: 1 },
    /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    /* glsl */ `
      uniform float uTime;
      uniform float uSeed;
      uniform float uOpacity;
      varying vec2 vUv;

      void main() {
        vec2 grid = vec2(26.0, 56.0);
        vec2 cell = fract(vUv * grid);
        float px = smoothstep(0.08, 0.22, cell.x) * (1.0 - smoothstep(0.78, 0.92, cell.x))
                 * smoothstep(0.08, 0.22, cell.y) * (1.0 - smoothstep(0.78, 0.92, cell.y));
        float t = uTime * 0.12 + uSeed * 7.0;
        float band = sin((vUv.x * 1.5 + vUv.y * 2.5 + t) * 6.2831853) * 0.5 + 0.5;
        float wave = sin((vUv.y * 3.0 - t * 1.4) * 6.2831853) * 0.5 + 0.5;
        vec3 c1 = vec3(0.1, 0.55, 1.0);
        vec3 c2 = vec3(1.0, 0.25, 0.65);
        vec3 c3 = vec3(0.15, 1.0, 0.7);
        vec3 col = mix(mix(c1, c2, band), c3, smoothstep(0.35, 0.95, wave) * 0.6);
        float scanline = 0.85 + 0.15 * sin(vUv.y * 320.0 + uTime * 3.0);
        gl_FragColor = vec4(col * (0.3 + 0.7 * px) * scanline * 1.35, uOpacity);
      }
    `
  )
);

/** 探照灯锥体材质：尖端亮、远端淡出 */
export const ConeLightMaterial = extend(
  shaderMaterial(
    { uColor: new Color("#cfe9ff"), uOpacity: 0.12 },
    /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        float a = pow(vUv.y, 1.4) * uOpacity;
        gl_FragColor = vec4(uColor, a);
      }
    `
  )
);
