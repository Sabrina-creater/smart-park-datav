<div align="center">
  <h1>上海外滩数字孪生运营中心</h1>
  <p>基于 Three.js + React 19 + ECharts 的上海外滩 · 陆家嘴 3D 数字孪生大屏</p>
  <p>程序化地标建筑 · 镜面黄浦江 · 游船车流 · 数据飞线 · 光束粒子 · 图表与 3D 场景双向联动</p>
  <p>
    <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React">
    <img src="https://img.shields.io/badge/Three.js-0.183-black?style=flat-square&logo=three.js" alt="Three.js">
    <img src="https://img.shields.io/badge/ECharts-6-aa344d?style=flat-square&logo=apacheecharts" alt="ECharts">
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite" alt="Vite">
  </p>
</div>

![预览](./public/preview.jpg)

> 本项目基于开源模板 [knight-L/sc-datav](https://github.com/knight-L/sc-datav) 二次开发，把"省级 3D 地图大屏"改造成了以上海外滩为场景的数字孪生运营大屏：浦西外滩历史建筑群、黄浦江与外白渡桥、浦东陆家嘴天际线全部由代码程序化生成，无需任何模型文件。建筑形态与相对位置按真实布局示意，所有指标均为演示用模拟数据，集中放在 `src/data/bund.ts`，换成自己的场景数据即可直接使用。

## 功能特性

| 模块 | 说明 |
| --- | --- |
| 3D 外滩场景 | 27 栋建筑由数据驱动程序化生成（无需建模）：东方明珠、上海中心（扭转收分）、环球金融中心（薄刃开口）、金茂大厦（逐级收分）、汇丰银行穹顶、海关大楼钟楼、和平饭店与中国银行的金字塔屋顶、国际会议中心双球，以及外滩历史建筑群；另有背景楼块、两岸地块、道路与行道树 |
| 建筑材质 | 两套自定义 Shader：立面材质（渐变 + 程序化夜景窗户 + 扫光带），曲面材质（渐变 + 菲涅尔辉光 + 扫光）；悬停/选中高亮，未选中建筑自动变暗 |
| 黄浦江 | 镜面反射江面（按原色倒映两岸灯光）+ 按岸别着色的横向波光 Shader；苏州河与外白渡桥钢拱（拱上串灯）；地平线霞光天幕 |
| 夜景灯光 | 参考真实外滩夜景：历史建筑暖金色泛光（底亮上暗、深色屋顶配檐口亮框）、东方明珠粉紫蓝流转变色、上海中心螺旋灯带与顶部亮环、环球金融中心开口亮框、金茂大厦金色灯格、震旦 / 花旗面江 LED 巨幕、超高层楼顶航空障碍灯闪烁（带光晕）、观景平台与道路路灯（灯头光晕 + 地面光斑）+ 江堤连续灯带、游船变色串灯与水面光斑、三束带体积感的探照灯；自定义着色器已做 sRGB 色彩管理 |
| 开场动画 | 镜头从高空推进，建筑依次"生长"，面板随后滑入 |
| 数据飞线 | 各建筑 → 东方明珠 的贝塞尔飞线，纹理流动 |
| 光束粒子 | 两岸上空缓缓上升的光束 |
| 车流与游船 | 中山东一路、滨江大道、陆家嘴环路三条车流路线；黄浦江上游船与轮渡巡航，随浪轻微起伏 |
| 告警定位 | 存在未关闭告警的建筑脚下显示红色脉冲光圈 |
| 双向联动 | 点击 3D 建筑 / 告警列表行 / 底部建筑芯片，镜头自动飞向该建筑并展示详情；点击空白处或"返回全景"回到全景 |
| 图表面板 | 外滩概况（实时跳动）、24h 客流（自动滚动窗口）、中山东一路车辆通行（提示框轮播）、环境舒适度雷达 + 实时指标、业态分布玫瑰图、安防告警无缝滚动表、建筑详情（含该建筑 24h 客流估算） |
| 工具栏 | 一键开关飞线 / 光束与探照灯 / 标签 / 车流 / 游船 / 自动巡览 |
| 自适应 | 基于 autofit.js 按 1920 × 1080 设计稿等比缩放，适配任意分辨率大屏 |

## 技术栈

- **框架**：React 19 + TypeScript 5.9
- **构建**：Vite 8（Rolldown）
- **3D**：Three.js + @react-three/fiber + @react-three/drei
- **图表**：ECharts 6（按需引入）
- **动画**：GSAP
- **状态**：Zustand
- **样式**：styled-components
- **自适应**：autofit.js

## 快速开始

```bash
# 环境要求：Node.js >= 20，pnpm >= 9
pnpm install

# 开发
pnpm dev

# 构建 / 预览
pnpm build
pnpm preview

# Lint（类型检查包含在 build 中）
pnpm lint
```

本地开发默认地址为 `http://localhost:5173/smart-park-datav/`（base 与仓库名一致，便于部署到 GitHub Pages）。如需部署到根路径：`VITE_BASE=/ pnpm build`。

## 换成自己的数据

所有演示数据集中在 **`src/data/bund.ts`**，改这里即可：

| 字段 | 用途 |
| --- | --- |
| `buildings` | 建筑列表：名称、类型、形态 `shape`（box / pearl / twist / swfc / jinmao / dome / clock / pyramid / globe）、位置 `[x, z]`、尺寸 `[宽, 高, 深]`、实际高度、层数、建成年份、在场人数、能耗、负荷。3D 场景、标签、详情卡、飞线全部由它驱动 |
| `BUILDING_PALETTE` / `FLOODLIT_TYPES` | 各类型建筑的配色（底色 / 顶色 / 扫光色 / 窗灯色）与泛光照明类型 |
| `lampLines` / `searchlights` | 路灯布置线与探照灯位置 |
| `fillers` | 不参与交互的背景楼块 |
| `waters` / `bridge` | 黄浦江、苏州河水域与外白渡桥位置 |
| `roads` / `vehicleRoutes` / `boatRoutes` | 道路中心线、车辆巡游路线、游船航线 |
| `overview` / `visitorFlow` / `traffic` / `environment*` / `industries` | 左右面板各图表数据 |
| `alarms` | 告警列表，`buildingId` 关联建筑，未关闭的告警会在 3D 场景中标红 |

- 全局配色在 `src/theme.ts`，改一处即可整体换肤。
- 大屏标题、副标题在 `src/pages/Park/panel/header.tsx`。
- 实时数据模拟在 `src/stores/index.ts` 的 `useLiveStore.tick`，接真实接口时替换为轮询 / WebSocket 即可。

## 目录结构

```
src/
├── assets/                 # 贴图素材（飞线、光圈、光环）
├── components/             # 通用组件
│   ├── autoFit.tsx         # 等比缩放容器
│   ├── chart.tsx           # ECharts 封装（按需加载 + 自动 resize）
│   ├── numberAnimation.tsx # 数字滚动动画
│   ├── seamVirtualScroll.tsx # 无缝滚动表格（支持行点击）
│   └── loading.tsx
├── data/bund.ts            # ★ 场景数据（建筑 / 道路 / 水域 / 指标 / 告警）
├── hooks/                  # useMoveTo / useRafInterval / useSize ...
├── stores/index.ts         # Zustand：场景开关、选中建筑、实时数据
├── theme.ts                # ★ 全局配色
└── pages/Park/
    ├── index.tsx           # 页面入口
    ├── scene/              # 3D 场景
    │   ├── index.tsx       # Canvas / 控制器 / 场景组装
    │   ├── lights.tsx      # 环境光与两岸点光源
    │   ├── materials.tsx   # 立面 / 曲面 / 光束 / 波光 / LED 巨幕 / 探照灯 Shader
    │   ├── textures.ts     # 运行时生成的径向光晕贴图
    │   ├── lamps.tsx       # 路灯（Instanced）
    │   ├── searchlights.tsx # 探照灯
    │   ├── sky.tsx         # 天幕霞光
    │   ├── landmarks.tsx   # 地标形态（东方明珠、上海中心、环球、金茂、穹顶、钟楼…）
    │   ├── buildings.tsx   # 建筑（生长动画、交互、背景楼块）
    │   ├── label.tsx       # 建筑标签
    │   ├── ground.tsx      # 两岸地块、观景平台、网格、光环
    │   ├── river.tsx       # 黄浦江镜面与波光、苏州河
    │   ├── bridge.tsx      # 外白渡桥
    │   ├── roads.tsx       # 道路
    │   ├── trees.tsx       # 行道树与绿地（Instanced）
    │   ├── paths.ts        # 闭合圆角路线
    │   ├── vehicles.tsx    # 车流
    │   ├── boats.tsx       # 游船与轮渡
    │   ├── flyLine.tsx     # 数据飞线
    │   ├── beamLight.tsx   # 光束粒子
    │   ├── alarmRings.tsx  # 告警光圈
    │   └── cameraRig.tsx   # 开场镜头 + 选中飞行
    └── panel/              # 2D 面板
        ├── index.tsx       # 布局（4 列 × 6 行栅格）
        ├── header.tsx      # 标题栏 / 时钟 / 天气
        ├── toolbar.tsx     # 场景开关
        ├── card.tsx        # 卡片边框
        ├── overview.tsx    # 外滩概况
        ├── flow.tsx        # 客流监测
        ├── traffic.tsx     # 车辆通行
        ├── environment.tsx # 环境监测
        ├── business.tsx    # 业态分布
        ├── alarms.tsx      # 安防告警
        └── detail.tsx      # 建筑详情（联动）
```

## 部署到 GitHub Pages

仓库内置 `.github/workflows/deploy.yml`：推送到 `main` 分支会自动构建并通过 GitHub Actions 发布到 Pages，首次运行会自动启用 Pages，发布地址为 `https://<用户名>.github.io/<仓库名>/`。工作流会自动把 `VITE_BASE` 设为 `/<仓库名>/`，仓库改名也无需改代码。若首次运行提示没有权限启用 Pages，到仓库 **Settings → Pages** 把 Source 选为 **GitHub Actions** 后重新运行即可。

## 致谢与许可

- 模板来源：[knight-L/sc-datav](https://github.com/knight-L/sc-datav)（Apache-2.0），详见 [NOTICE](./NOTICE)
- 本项目同样以 [Apache-2.0](./LICENSE) 协议开源
