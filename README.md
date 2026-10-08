<div align="center">
  <h1>智慧园区数字孪生运营中心</h1>
  <p>基于 Three.js + React 19 + ECharts 的智慧园区 3D 可视化大屏</p>
  <p>程序化 3D 园区 · 楼宇扫光 · 数据飞线 · 光束粒子 · 车流巡游 · 图表与 3D 场景双向联动</p>
  <p>
    <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React">
    <img src="https://img.shields.io/badge/Three.js-0.183-black?style=flat-square&logo=three.js" alt="Three.js">
    <img src="https://img.shields.io/badge/ECharts-6-aa344d?style=flat-square&logo=apacheecharts" alt="ECharts">
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite" alt="Vite">
  </p>
</div>

![预览](./public/preview.jpg)

> 本项目基于开源模板 [knight-L/sc-datav](https://github.com/knight-L/sc-datav) 二次开发，把"省级 3D 地图大屏"改造成了"智慧园区数字孪生大屏"。所有数据均为演示用的模拟数据，集中放在 `src/data/park.ts`，换成自己园区的数据即可直接使用。

## 功能特性

| 模块 | 说明 |
| --- | --- |
| 3D 园区场景 | 17 栋楼宇由数据驱动程序化生成（无需建模），镜面地面 + 无限网格 + 园区地块 + 道路与虚线车道 + 行道树 |
| 楼宇材质 | 自定义 Shader：底部→顶部渐变、程序化夜景窗户（随机点亮/闪烁）、自下而上的扫光带、悬停/选中高亮、未选中楼宇自动变暗 |
| 开场动画 | 镜头从高空推进，楼宇依次"生长"，面板随后滑入 |
| 数据飞线 | 各楼宇 → 运营中心 的贝塞尔飞线，纹理流动 |
| 光束粒子 | 园区上空缓缓上升的光束 |
| 车流巡游 | 环路 / 内环 / 支路三条闭合路线，车辆带车灯沿圆角路线行驶 |
| 告警定位 | 存在未关闭告警的楼宇脚下显示红色脉冲光圈 |
| 双向联动 | 点击 3D 楼宇 / 楼宇标签 / 告警列表行 / 底部楼宇芯片，镜头自动飞向该楼并展示详情；点击空白处或"返回全景"回到全景 |
| 图表面板 | 园区概况（实时跳动）、24h 电力负荷（自动滚动窗口）、车辆通行（提示框轮播）、环境舒适度雷达 + 实时指标、产业分布玫瑰图、安防告警无缝滚动表 |
| 工具栏 | 一键开关飞线 / 光束 / 标签 / 车流 / 自动巡览 |
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

所有演示数据集中在 **`src/data/park.ts`**，改这里即可：

| 字段 | 用途 |
| --- | --- |
| `buildings` | 楼宇列表：名称、类型、位置 `[x, z]`、尺寸 `[宽, 高, 深]`、层数、企业数、人数、能耗、入驻率。3D 场景、标签、详情卡、飞线全部由它驱动 |
| `BUILDING_PALETTE` | 各类型楼宇的配色（底色 / 顶色 / 扫光色） |
| `roads` / `vehicleRoutes` | 道路中心线 与 车辆巡游路线 |
| `overview` / `energyLoad` / `traffic` / `environment*` / `industries` | 左右面板各图表数据 |
| `alarms` | 告警列表，`buildingId` 关联楼宇，未关闭的告警会在 3D 场景中标红 |

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
├── data/park.ts            # ★ 园区数据（楼宇 / 道路 / 指标 / 告警）
├── hooks/                  # useMoveTo / useRafInterval / useSize ...
├── stores/index.ts         # Zustand：场景开关、选中楼宇、实时数据
├── theme.ts                # ★ 全局配色
└── pages/Park/
    ├── index.tsx           # 页面入口
    ├── scene/              # 3D 场景
    │   ├── index.tsx       # Canvas / 灯光 / 控制器
    │   ├── materials.tsx   # 楼宇 Shader、光束 Shader
    │   ├── buildings.tsx   # 楼宇（生长动画、交互）
    │   ├── label.tsx       # 楼宇标签
    │   ├── ground.tsx      # 镜面地面、地块、网格、光环
    │   ├── roads.tsx       # 道路
    │   ├── trees.tsx       # 行道树（Instanced）
    │   ├── vehicles.tsx    # 车流
    │   ├── flyLine.tsx     # 数据飞线
    │   ├── beamLight.tsx   # 光束粒子
    │   ├── alarmRings.tsx  # 告警光圈
    │   └── cameraRig.tsx   # 开场镜头 + 选中飞行
    └── panel/              # 2D 面板
        ├── index.tsx       # 布局（4 列 × 6 行栅格）
        ├── header.tsx      # 标题栏 / 时钟 / 天气
        ├── toolbar.tsx     # 场景开关
        ├── card.tsx        # 卡片边框
        ├── overview.tsx    # 园区概况
        ├── energy.tsx      # 能耗监测
        ├── traffic.tsx     # 车辆通行
        ├── environment.tsx # 环境监测
        ├── enterprises.tsx # 产业分布
        ├── alarms.tsx      # 安防告警
        └── detail.tsx      # 楼宇详情（联动）
```

## 部署到 GitHub Pages

仓库内置 `.github/workflows/deploy.yml`：推送到 `main` 分支会自动构建并通过 GitHub Actions 发布到 Pages，首次运行会自动启用 Pages，发布地址为 `https://<用户名>.github.io/<仓库名>/`。工作流会自动把 `VITE_BASE` 设为 `/<仓库名>/`，仓库改名也无需改代码。若首次运行提示没有权限启用 Pages，到仓库 **Settings → Pages** 把 Source 选为 **GitHub Actions** 后重新运行即可。

## 致谢与许可

- 模板来源：[knight-L/sc-datav](https://github.com/knight-L/sc-datav)（Apache-2.0），详见 [NOTICE](./NOTICE)
- 本项目同样以 [Apache-2.0](./LICENSE) 协议开源
