/**
 * 园区静态数据：楼宇、道路、告警、能耗、环境……
 * 换成自己园区的数据即可直接复用整套大屏。
 * 场景坐标单位为"米"的缩放值：x 向右，z 向下（屏幕方向），y 为高度。
 */

export type BuildingType =
  | "center"
  | "office"
  | "lab"
  | "factory"
  | "dorm"
  | "datacenter"
  | "service"
  | "energy";

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  /** [x, z] 楼宇中心点 */
  position: [number, number];
  /** [宽, 高, 深] */
  size: [number, number, number];
  floors: number;
  companies: number;
  people: number;
  /** 今日用电 kWh */
  energyToday: number;
  /** 入驻率 0-1 */
  occupancy: number;
}

export const BUILDING_TYPE_LABEL: Record<BuildingType, string> = {
  center: "运营中心",
  office: "办公楼",
  lab: "研发楼",
  factory: "智造车间",
  dorm: "人才公寓",
  datacenter: "数据中心",
  service: "配套服务",
  energy: "能源站",
};

/** 各类型楼宇的配色：[底部色, 顶部色, 扫光色] */
export const BUILDING_PALETTE: Record<BuildingType, [string, string, string]> =
  {
    center: ["#0b2d5c", "#3fb6ff", "#9be4ff"],
    office: ["#0a2448", "#2f8de0", "#8fd3ff"],
    lab: ["#0c2a4c", "#2fa7c9", "#8ff0ff"],
    factory: ["#0d2340", "#3a7fbf", "#7fc4ff"],
    dorm: ["#15204a", "#6c7fd6", "#b8c4ff"],
    datacenter: ["#081f3f", "#1fb5a5", "#7ffde6"],
    service: ["#1a2b45", "#5f9bc9", "#a9d8ff"],
    energy: ["#2a2a12", "#d4a93a", "#ffe08a"],
  };

export const buildings: Building[] = [
  { id: "A1", name: "园区运营中心", type: "center", position: [0, 0], size: [6, 13, 6], floors: 26, companies: 12, people: 1860, energyToday: 1280, occupancy: 0.98 },
  { id: "A2", name: "会议中心", type: "service", position: [-6.5, 0], size: [4, 4, 5], floors: 3, companies: 1, people: 120, energyToday: 210, occupancy: 1 },
  { id: "A3", name: "科技展厅", type: "service", position: [6.5, 0], size: [4, 3.5, 5], floors: 2, companies: 1, people: 60, energyToday: 160, occupancy: 1 },
  { id: "B1", name: "研发一号楼", type: "lab", position: [-18.5, -11.5], size: [5, 8, 5], floors: 12, companies: 9, people: 980, energyToday: 620, occupancy: 0.95 },
  { id: "B2", name: "研发二号楼", type: "lab", position: [-12.5, -11.5], size: [4, 6.5, 5], floors: 10, companies: 7, people: 720, energyToday: 480, occupancy: 0.9 },
  { id: "C1", name: "创新研发中心", type: "lab", position: [-5, -11.5], size: [7, 9.5, 5], floors: 15, companies: 14, people: 1420, energyToday: 860, occupancy: 0.96 },
  { id: "C2", name: "中试实验楼", type: "lab", position: [4.5, -11.5], size: [6, 6, 5], floors: 8, companies: 6, people: 460, energyToday: 540, occupancy: 0.88 },
  { id: "D1", name: "算力数据中心", type: "datacenter", position: [16, -11.5], size: [8, 5, 5], floors: 4, companies: 3, people: 90, energyToday: 1960, occupancy: 0.82 },
  { id: "E1", name: "总部办公 A 座", type: "office", position: [-16, -3.2], size: [8, 7, 4], floors: 11, companies: 18, people: 1540, energyToday: 720, occupancy: 0.94 },
  { id: "E2", name: "总部办公 B 座", type: "office", position: [-16, 3.2], size: [8, 7, 4], floors: 11, companies: 16, people: 1380, energyToday: 690, occupancy: 0.91 },
  { id: "F1", name: "智造车间一", type: "factory", position: [16, -3.2], size: [9, 4, 4], floors: 2, companies: 2, people: 420, energyToday: 1120, occupancy: 1 },
  { id: "F2", name: "智造车间二", type: "factory", position: [16, 3.2], size: [9, 4, 4], floors: 2, companies: 2, people: 380, energyToday: 1040, occupancy: 1 },
  { id: "G1", name: "人才公寓一期", type: "dorm", position: [-18.5, 11.5], size: [5, 9, 5], floors: 16, companies: 0, people: 1260, energyToday: 380, occupancy: 0.86 },
  { id: "G2", name: "人才公寓二期", type: "dorm", position: [-12.5, 11.5], size: [5, 9, 5], floors: 16, companies: 0, people: 1180, energyToday: 360, occupancy: 0.79 },
  { id: "H1", name: "员工食堂", type: "service", position: [-5, 11.5], size: [7, 3, 5], floors: 2, companies: 1, people: 80, energyToday: 310, occupancy: 1 },
  { id: "H2", name: "立体停车楼", type: "service", position: [4.5, 11.5], size: [7, 4.5, 5], floors: 5, companies: 0, people: 12, energyToday: 140, occupancy: 0.68 },
  { id: "I1", name: "综合能源站", type: "energy", position: [16, 11.5], size: [6, 3.5, 5], floors: 2, companies: 1, people: 24, energyToday: 90, occupancy: 1 },
];

export const buildingMap = Object.fromEntries(
  buildings.map((b) => [b.id, b])
) as Record<string, Building>;

/** 园区地块尺寸 [宽, 深] */
export const PARK_SIZE: [number, number] = [50, 38];

export interface Road {
  /** 起点 [x, z] */
  from: [number, number];
  /** 终点 [x, z] */
  to: [number, number];
  width?: number;
}

/** 道路（中心线） */
export const roads: Road[] = [
  // 环路
  { from: [-22, -16], to: [22, -16] },
  { from: [-22, 16], to: [22, 16] },
  { from: [-22, -16], to: [-22, 16] },
  { from: [22, -16], to: [22, 16] },
  // 内部主干道
  { from: [-22, -7], to: [22, -7] },
  { from: [-22, 7], to: [22, 7] },
  { from: [-10, -16], to: [-10, 16] },
  { from: [10, -16], to: [10, 16] },
];

/** 车辆巡游路线（闭合） */
export const vehicleRoutes: {
  points: [number, number][];
  color: string;
  count: number;
  speed: number;
}[] = [
  {
    points: [
      [-21.4, -15.4],
      [21.4, -15.4],
      [21.4, 15.4],
      [-21.4, 15.4],
    ],
    color: "#ffd166",
    count: 4,
    speed: 0.045,
  },
  {
    points: [
      [-9.4, -6.4],
      [9.4, -6.4],
      [9.4, 6.4],
      [-9.4, 6.4],
    ],
    color: "#7ff0ff",
    count: 3,
    speed: 0.07,
  },
  {
    points: [
      [-21.4, -6.4],
      [-10.6, -6.4],
      [-10.6, 6.4],
      [-21.4, 6.4],
    ],
    color: "#ff8fa3",
    count: 2,
    speed: 0.06,
  },
];

/** 园区总览指标 */
export const overview = {
  companies: 128,
  people: 12680,
  energyToday: 8642,
  parkingUsed: 356,
  parkingTotal: 520,
  occupancy: 0.92,
  chargingUsed: 18,
  chargingTotal: 40,
};

/** 24 小时电力负荷 (kW) */
export const energyLoad = {
  hours: Array.from({ length: 24 }, (_, h) => `${`${h}`.padStart(2, "0")}:00`),
  today: [
    420, 380, 350, 340, 360, 420, 640, 980, 1420, 1680, 1760, 1720, 1560, 1690,
    1780, 1740, 1620, 1380, 1120, 960, 820, 700, 580, 480,
  ],
  yesterday: [
    440, 400, 370, 350, 370, 450, 620, 940, 1360, 1620, 1700, 1680, 1520, 1640,
    1720, 1700, 1580, 1340, 1080, 940, 800, 680, 560, 470,
  ],
};

/** 车辆通行（每 2 小时） */
export const traffic = {
  slots: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
  in: [12, 6, 4, 38, 286, 142, 96, 88, 74, 120, 46, 22],
  out: [18, 8, 5, 14, 42, 68, 110, 92, 158, 264, 96, 40],
};

/** 环境监测 */
export const environment = {
  temperature: 24.6,
  humidity: 58,
  pm25: 32,
  noise: 46,
  co2: 480,
  wind: 2.4,
  aqi: 42,
  aqiLevel: "优",
  weather: "晴",
};

/** 环境雷达指标（值越大越好，已归一到 0-100） */
export const environmentRadar = [
  { name: "温度舒适度", value: 86, max: 100 },
  { name: "湿度舒适度", value: 78, max: 100 },
  { name: "空气质量", value: 92, max: 100 },
  { name: "噪音控制", value: 74, max: 100 },
  { name: "CO₂ 浓度", value: 88, max: 100 },
  { name: "绿化覆盖", value: 81, max: 100 },
];

/** 产业分布 */
export const industries = [
  { name: "人工智能", value: 36 },
  { name: "集成电路", value: 24 },
  { name: "生物医药", value: 18 },
  { name: "新能源", value: 22 },
  { name: "智能制造", value: 28 },
];

export type AlarmLevel = "高" | "中" | "低";
export type AlarmStatus = "待处理" | "处理中" | "已处理";

export interface Alarm {
  id: number;
  time: string;
  buildingId: string;
  type: string;
  level: AlarmLevel;
  status: AlarmStatus;
}

export const alarms: Alarm[] = [
  { id: 1, time: "09:42", buildingId: "D1", type: "机房高温预警", level: "高", status: "待处理" },
  { id: 2, time: "09:38", buildingId: "F1", type: "烟感告警", level: "高", status: "处理中" },
  { id: 3, time: "09:31", buildingId: "G2", type: "门禁异常", level: "中", status: "待处理" },
  { id: 4, time: "09:20", buildingId: "H2", type: "车辆违停", level: "低", status: "待处理" },
  { id: 5, time: "09:05", buildingId: "E1", type: "电梯困人", level: "高", status: "已处理" },
  { id: 6, time: "08:52", buildingId: "B1", type: "设备离线", level: "中", status: "处理中" },
  { id: 7, time: "08:47", buildingId: "I1", type: "储能柜温升", level: "中", status: "待处理" },
  { id: 8, time: "08:30", buildingId: "C2", type: "实验室气体泄漏", level: "高", status: "已处理" },
  { id: 9, time: "08:12", buildingId: "A1", type: "周界入侵", level: "中", status: "已处理" },
  { id: 10, time: "07:58", buildingId: "G1", type: "水浸告警", level: "中", status: "已处理" },
  { id: 11, time: "07:40", buildingId: "E2", type: "摄像头离线", level: "低", status: "处理中" },
  { id: 12, time: "07:21", buildingId: "F2", type: "能耗超限", level: "低", status: "已处理" },
  { id: 13, time: "06:55", buildingId: "H1", type: "燃气浓度异常", level: "高", status: "已处理" },
  { id: 14, time: "06:30", buildingId: "C1", type: "门禁异常", level: "低", status: "已处理" },
  { id: 15, time: "06:02", buildingId: "B2", type: "设备离线", level: "低", status: "已处理" },
];

export const ALARM_LEVEL_COLOR: Record<AlarmLevel, string> = {
  高: "#ff5f6d",
  中: "#ffb400",
  低: "#3fb6ff",
};

export const ALARM_STATUS_COLOR: Record<AlarmStatus, string> = {
  待处理: "#ff5f6d",
  处理中: "#ffb400",
  已处理: "#35d6a0",
};

/** 存在未关闭告警的楼宇 */
export const alarmBuildingIds = Array.from(
  new Set(alarms.filter((a) => a.status !== "已处理").map((a) => a.buildingId))
);
