/**
 * 上海外滩数字孪生场景数据：两岸建筑、道路、水域、客流、告警……
 * 建筑形态与相对位置按真实外滩 / 陆家嘴布局示意，所有指标为演示用模拟数据。
 * 场景坐标：y 为高度；z 向下为西（靠近观众的一侧是浦西外滩）；x 向左为北、向右为南，
 * 与站在外滩面向浦东时「东方明珠、外白渡桥在左手边」的真实视角一致。
 */

export type BuildingType =
  | "landmark"
  | "skyscraper"
  | "historic"
  | "hotel"
  | "office"
  | "culture";

/** 程序化建筑形态 */
export type BuildingShape =
  | "box"
  | "pearl"
  | "twist"
  | "swfc"
  | "jinmao"
  | "dome"
  | "clock"
  | "pyramid"
  | "globe";

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  shape?: BuildingShape;
  /** [x, z] 建筑中心点 */
  position: [number, number];
  /** [宽, 高, 深] 场景尺寸 */
  size: [number, number, number];
  /** 实际高度 m */
  height: number;
  floors: number;
  builtYear: number;
  /** 当前在场人数 */
  people: number;
  /** 今日用电 kWh */
  energyToday: number;
  /** 运行负荷 / 承载率 0-1 */
  load: number;
  /** 屋顶 / 点缀色（金字塔屋顶等形态使用） */
  accent?: string;
  /** 常显标签；未设置的建筑仅在悬停 / 选中时显示标签 */
  label?: boolean;
  /** 朝向外滩一侧的 LED 巨幕 */
  screen?: boolean;
  /** 楼顶航空障碍灯 */
  beacon?: boolean;
}

export const BUILDING_TYPE_LABEL: Record<BuildingType, string> = {
  landmark: "城市地标",
  skyscraper: "超高层",
  historic: "历史建筑",
  hotel: "酒店",
  office: "商务楼",
  culture: "文化场馆",
};

/** 各类型建筑的配色：[底部色, 顶部色, 扫光色, 窗灯色]；历史建筑为泛光照明：底部亮、上部暗 */
export const BUILDING_PALETTE: Record<
  BuildingType,
  [string, string, string, string]
> = {
  landmark: ["#4a1060", "#ff4fd8", "#ffb3f0", "#ffd6ff"],
  skyscraper: ["#0a2448", "#3fb6ff", "#9be4ff", "#dff4ff"],
  historic: ["#ffc45e", "#5a3a0e", "#ffe9a8", "#ffe0a0"],
  hotel: ["#f0b24a", "#4a3014", "#ffe3b0", "#ffe0a0"],
  office: ["#0c2a4c", "#2fa7c9", "#8ff0ff", "#d9f8ff"],
  culture: ["#0b2d3a", "#35d6a0", "#a8ffe0", "#d0ffee"],
};

/** 泛光照明的建筑类型（自下而上打亮，檐口发光） */
export const FLOODLIT_TYPES: BuildingType[] = ["historic", "hotel"];

export const buildings: Building[] = [
  // ---------- 浦东 · 陆家嘴（对岸，z < 0） ----------
  { id: "P1", beacon: true, label: true, name: "东方明珠", type: "landmark", shape: "pearl", position: [-15.5, -10], size: [5, 33, 5], height: 468, floors: 3, builtYear: 1994, people: 6800, energyToday: 9800, load: 0.76 },
  { id: "P2", beacon: true, label: true, name: "上海中心大厦", type: "skyscraper", shape: "twist", position: [8.5, -15.5], size: [6, 45, 6], height: 632, floors: 128, builtYear: 2015, people: 12400, energyToday: 38600, load: 0.71 },
  { id: "P3", beacon: true, label: true, name: "环球金融中心", type: "skyscraper", shape: "swfc", position: [2.5, -19.5], size: [5, 35, 4], height: 492, floors: 101, builtYear: 2008, people: 9600, energyToday: 29400, load: 0.68 },
  { id: "P4", beacon: true, name: "金茂大厦", type: "skyscraper", shape: "jinmao", position: [-6.5, -14.5], size: [5, 30, 5], height: 420, floors: 88, builtYear: 1999, people: 8200, energyToday: 24800, load: 0.73 },
  { id: "P5", name: "上海国际会议中心", type: "culture", shape: "globe", position: [-24, -10], size: [8, 4, 5], height: 70, floors: 10, builtYear: 1999, people: 1900, energyToday: 6200, load: 0.52 },
  { id: "P6", beacon: true, screen: true, name: "震旦国际大楼", type: "office", position: [-9, -9], size: [4, 13, 4], height: 185, floors: 38, builtYear: 2003, people: 3000, energyToday: 8200, load: 0.82 },
  { id: "P7", beacon: true, name: "中银大厦", type: "office", position: [15, -14], size: [4, 18, 4], height: 226, floors: 53, builtYear: 2000, people: 3600, energyToday: 9800, load: 0.79 },
  { id: "P8", beacon: true, name: "平安金融大厦", type: "office", position: [-13, -20], size: [4, 17, 4], height: 233, floors: 48, builtYear: 2009, people: 3300, energyToday: 9100, load: 0.74 },
  { id: "P9", screen: true, name: "花旗集团大厦", type: "office", position: [-19, -16], size: [4, 14, 4], height: 180, floors: 42, builtYear: 2005, people: 2800, energyToday: 7600, load: 0.69 },
  { id: "P10", beacon: true, name: "上海国金中心", type: "office", position: [17, -20], size: [4, 19, 4], height: 260, floors: 58, builtYear: 2010, people: 4300, energyToday: 12400, load: 0.8 },
  { id: "P11", name: "浦东美术馆", type: "culture", position: [-35, -8.8], size: [6, 3.5, 4], height: 30, floors: 4, builtYear: 2021, people: 1400, energyToday: 2600, load: 0.47 },
  { id: "P12", beacon: true, name: "浦东香格里拉大酒店", type: "hotel", position: [5, -9.5], size: [5, 12, 4], height: 152, floors: 36, builtYear: 1998, people: 1700, energyToday: 8400, load: 0.86 },

  // ---------- 浦西 · 外滩建筑群（近岸，z > 0，自南向北即自右向左；汉口路、南京东路、北京东路位于真实的楼间缺口） ----------
  { id: "B1", name: "亚细亚大楼", type: "historic", position: [35.8, 15.5], size: [5, 5.2, 4], height: 36, floors: 8, builtYear: 1916, people: 320, energyToday: 1100, load: 0.58 },
  { id: "B2", name: "上海总会大楼", type: "historic", position: [30.55, 15.5], size: [4.5, 4.6, 4], height: 30, floors: 6, builtYear: 1910, people: 260, energyToday: 960, load: 0.62 },
  { id: "B5", name: "汇丰银行大楼", type: "historic", shape: "dome", position: [23.55, 15.5], size: [8.5, 5.4, 4.5], height: 40, floors: 7, builtYear: 1923, people: 860, energyToday: 2400, load: 0.66 },
  { id: "B6", label: true, name: "海关大楼", type: "historic", shape: "clock", position: [16.05, 15.5], size: [5.5, 9.6, 4.5], height: 79, floors: 11, builtYear: 1927, people: 540, energyToday: 1800, load: 0.6 },
  { id: "B7", name: "交通银行大楼", type: "historic", position: [7.8, 15.5], size: [4, 4.6, 4], height: 31, floors: 6, builtYear: 1948, people: 300, energyToday: 1040, load: 0.57 },
  { id: "B8", name: "字林西报大楼", type: "historic", position: [3.4, 15.5], size: [3.8, 4.9, 4], height: 38, floors: 9, builtYear: 1924, people: 330, energyToday: 1120, load: 0.63 },
  { id: "B9", name: "外滩18号", type: "historic", position: [-0.8, 15.5], size: [3.6, 4.6, 4], height: 30, floors: 5, builtYear: 1923, people: 420, energyToday: 1500, load: 0.78 },
  { id: "B10", name: "和平饭店南楼", type: "hotel", position: [-5.0, 15.5], size: [3.8, 4.4, 4], height: 28, floors: 6, builtYear: 1908, people: 260, energyToday: 1300, load: 0.81 },
  { id: "B11", label: true, name: "和平饭店北楼", type: "hotel", shape: "pyramid", position: [-12.4, 15.5], size: [5, 7.4, 4.5], height: 77, floors: 13, builtYear: 1929, people: 680, energyToday: 3200, load: 0.88, accent: "#3fd0a0" },
  { id: "B12", name: "中国银行大楼", type: "historic", shape: "pyramid", position: [-17.9, 15.5], size: [5, 6.2, 4.5], height: 70, floors: 17, builtYear: 1937, people: 760, energyToday: 2600, load: 0.64, accent: "#5aa0ff" },
  { id: "B13", name: "怡和洋行大楼", type: "historic", position: [-23.15, 15.5], size: [4.5, 4.8, 4], height: 32, floors: 7, builtYear: 1922, people: 290, energyToday: 1000, load: 0.56 },
  { id: "B14", name: "外滩源壹号", type: "culture", position: [-30, 20.5], size: [3.6, 2.6, 4], height: 15, floors: 2, builtYear: 1873, people: 160, energyToday: 420, load: 0.4 },
  { id: "B15", label: true, name: "上海大厦", type: "hotel", position: [-38.5, 15.5], size: [5, 7.5, 4.5], height: 77, floors: 22, builtYear: 1934, people: 520, energyToday: 2900, load: 0.74 },
];

export const buildingMap = Object.fromEntries(
  buildings.map((b) => [b.id, b])
) as Record<string, Building>;

/** 数据飞线汇聚点 */
export const CENTER_ID = "P1";

/** 背景填充楼块（不参与交互，仅增加城市密度） */
export const fillers: {
  position: [number, number];
  size: [number, number, number];
  type: BuildingType;
}[] = [
  // 浦东后排
  { position: [30, -26.6], size: [6, 9, 2.6], type: "office" },
  { position: [22, -26.6], size: [5, 12, 2.6], type: "office" },
  { position: [12, -26.6], size: [6, 8, 2.6], type: "office" },
  { position: [5, -26.6], size: [4, 14, 2.6], type: "office" },
  { position: [-8, -26.6], size: [5, 10, 2.6], type: "office" },
  { position: [-18, -26.6], size: [6, 7, 2.6], type: "office" },
  { position: [-26, -26.6], size: [5, 11, 2.6], type: "office" },
  { position: [-36, -26.6], size: [6, 6, 2.6], type: "office" },
  { position: [-36, -17], size: [5, 9, 4], type: "office" },
  { position: [36, -14], size: [5, 8, 4], type: "office" },
  { position: [36, -22], size: [5, 6, 4], type: "office" },
  // 浦西后排（老城厢街区）
  { position: [36, 21.5], size: [6, 3.2, 4], type: "historic" },
  { position: [27, 21.5], size: [6, 2.8, 4], type: "historic" },
  { position: [18, 21.5], size: [6, 3.6, 4], type: "historic" },
  { position: [5, 21.5], size: [6, 3, 4], type: "historic" },
  { position: [-3, 21.5], size: [6, 4, 4], type: "historic" },
  { position: [-14, 21.5], size: [6, 3.2, 4], type: "historic" },
  { position: [-22, 21.5], size: [6, 3.8, 4], type: "historic" },
  { position: [-39, 21.5], size: [5, 4.2, 4], type: "historic" },
];

/** 地块尺寸 [宽, 深] */
export const PARK_SIZE: [number, number] = [84, 56];

/** 水域（轴对齐矩形） */
export interface WaterRect {
  name: string;
  x: [number, number];
  z: [number, number];
}

export const waters: WaterRect[] = [
  { name: "黄浦江", x: [-42, 42], z: [-4, 8] },
  { name: "苏州河", x: [-35, -32], z: [8, 28] },
];

/** 路灯布置线：[起点, 终点, 间距] */
export const lampLines: { from: [number, number]; to: [number, number]; step: number }[] = [
  { from: [40, 8.7], to: [-31, 8.7], step: 2.2 },      // 外滩观景平台
  { from: [40, 13.4], to: [-31, 13.4], step: 3 },    // 中山东一路南侧
  { from: [-36, 13.4], to: [-40, 13.4], step: 4 },
  { from: [40, -7.4], to: [-40, -7.4], step: 5 },    // 滨江大道
  { from: [40, -3.6], to: [-40, -3.6], step: 6 },    // 浦东江岸
];

/** 探照灯位置（外滩观景平台上） */
export const searchlights: [number, number][] = [
  [22, 9.3],
  [-2, 9.3],
  [-24, 9.3],
];

/** 外白渡桥：跨苏州河，位于中山东一路上 */
export const bridge = { x: -33.5, z: 11.5, span: 5, width: 3.6 };

export interface Road {
  name: string;
  from: [number, number];
  to: [number, number];
  width?: number;
}

/** 道路（中心线） */
export const roads: Road[] = [
  { name: "中山东一路", from: [42, 11.5], to: [-42, 11.5], width: 3 },
  { name: "滨江大道", from: [42, -5.5], to: [-42, -5.5], width: 2.4 },
  { name: "世纪大道", from: [-2, -5.5], to: [-2, -28], width: 2.4 },
  { name: "陆家嘴环路·东", from: [-30, -5.5], to: [-30, -24], width: 2.4 },
  { name: "陆家嘴环路·西", from: [30, -5.5], to: [30, -24], width: 2.4 },
  { name: "陆家嘴环路·南", from: [30, -24], to: [-30, -24], width: 2.4 },
  { name: "汉口路", from: [11.3, 13], to: [11.3, 28], width: 2 },
  { name: "南京东路", from: [-8.4, 13], to: [-8.4, 28], width: 2 },
  { name: "北京东路", from: [-27, 13], to: [-27, 28], width: 2 },
];

/** 车辆巡游路线（闭合） */
export const vehicleRoutes: {
  points: [number, number][];
  color: string;
  count: number;
  speed: number;
}[] = [
  {
    points: [[41, 10.8], [-41, 10.8], [-41, 12.2], [41, 12.2]],
    color: "#ffd166",
    count: 7,
    speed: 0.03,
  },
  {
    points: [[41, -4.9], [-41, -4.9], [-41, -6.1], [41, -6.1]],
    color: "#7ff0ff",
    count: 4,
    speed: 0.035,
  },
  {
    points: [[29.5, -6.3], [-29.5, -6.3], [-29.5, -23.4], [29.5, -23.4]],
    color: "#ff8fa3",
    count: 5,
    speed: 0.03,
  },
];

/** 游船航线（闭合，黄浦江上） */
export const boatRoutes: {
  points: [number, number][];
  count: number;
  speed: number;
  kind: "cruise" | "ferry";
}[] = [
  {
    points: [[46, 0.5], [-46, 0.5], [-46, 2.5], [46, 2.5]],
    count: 4,
    speed: 0.012,
    kind: "cruise",
  },
  {
    points: [[46, 5], [-46, 5], [-46, 6.5], [46, 6.5]],
    count: 3,
    speed: 0.018,
    kind: "ferry",
  },
];

/** 总览指标（在场人数与用电量由各建筑汇总，保证与建筑详情一致） */
export const overview = {
  visitorsToday: 186420,
  peopleNow: buildings.reduce((sum, b) => sum + b.people, 0),
  energyToday: buildings.reduce((sum, b) => sum + b.energyToday, 0),
  devicesOnline: 3860,
  capacity: 0.64,
  parkingUsed: 1240,
  parkingTotal: 1800,
  boatOccupancy: 0.72,
  merchants: 630,
};

/** 24 小时客流（人 / 小时） */
export const visitorFlow = {
  hours: Array.from({ length: 24 }, (_, h) => `${`${h}`.padStart(2, "0")}:00`),
  today: [
    1200, 600, 300, 200, 300, 900, 2100, 3800, 5200, 6800, 7600, 8400, 8100,
    7900, 8600, 9200, 9800, 11200, 13800, 15200, 14100, 11800, 7600, 3600,
  ],
  yesterday: [
    1100, 550, 280, 220, 280, 860, 1900, 3500, 4900, 6300, 7100, 7900, 7700,
    7400, 8100, 8800, 9300, 10600, 12900, 14300, 13500, 11200, 7100, 3300,
  ],
};

/** 中山东一路车辆通行（每 2 小时） */
export const traffic = {
  slots: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
  in: [320, 140, 90, 260, 980, 1120, 960, 1040, 1180, 1420, 1360, 820],
  out: [360, 160, 80, 180, 820, 1060, 1010, 980, 1240, 1380, 1480, 960],
};

/** 环境监测 */
export const environment = {
  temperature: 22.8,
  humidity: 63,
  pm25: 28,
  noise: 58,
  co2: 460,
  wind: 3.6,
  aqi: 39,
  aqiLevel: "优",
  weather: "晴",
  waterLevel: 3.12,
};

/** 环境雷达（归一到 0-100，越大越好） */
export const environmentRadar = [
  { name: "温度舒适度", value: 88, max: 100 },
  { name: "湿度舒适度", value: 72, max: 100 },
  { name: "空气质量", value: 94, max: 100 },
  { name: "噪音控制", value: 62, max: 100 },
  { name: "江面水质", value: 84, max: 100 },
  { name: "绿化覆盖", value: 70, max: 100 },
];

/** 业态分布（商户数） */
export const industries = [
  { name: "金融机构", value: 120 },
  { name: "文旅观光", value: 86 },
  { name: "餐饮", value: 164 },
  { name: "零售", value: 212 },
  { name: "酒店", value: 48 },
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
  { id: 1, time: "20:42", buildingId: "B6", type: "观景平台人流密度预警", level: "高", status: "待处理" },
  { id: 2, time: "20:38", buildingId: "P1", type: "观光层客流超限", level: "高", status: "处理中" },
  { id: 3, time: "20:31", buildingId: "B11", type: "外立面灯光故障", level: "中", status: "待处理" },
  { id: 4, time: "20:20", buildingId: "P5", type: "码头游船靠泊异常", level: "中", status: "待处理" },
  { id: 5, time: "20:05", buildingId: "P2", type: "电梯困人", level: "高", status: "已处理" },
  { id: 6, time: "19:52", buildingId: "B5", type: "设备离线", level: "中", status: "处理中" },
  { id: 7, time: "19:47", buildingId: "B15", type: "江堤水位预警", level: "中", status: "待处理" },
  { id: 8, time: "19:30", buildingId: "P3", type: "消防烟感告警", level: "高", status: "已处理" },
  { id: 9, time: "19:12", buildingId: "B9", type: "门禁异常", level: "低", status: "已处理" },
  { id: 10, time: "18:58", buildingId: "P4", type: "能耗超限", level: "低", status: "已处理" },
  { id: 11, time: "18:40", buildingId: "B1", type: "摄像头离线", level: "低", status: "处理中" },
  { id: 12, time: "18:21", buildingId: "P12", type: "周界入侵", level: "中", status: "已处理" },
  { id: 13, time: "17:55", buildingId: "P11", type: "展厅温湿度异常", level: "低", status: "已处理" },
  { id: 14, time: "17:30", buildingId: "B12", type: "门禁异常", level: "低", status: "已处理" },
  { id: 15, time: "17:02", buildingId: "P6", type: "LED 屏幕离线", level: "低", status: "已处理" },
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

/** 存在未关闭告警的建筑 */
export const alarmBuildingIds = Array.from(
  new Set(alarms.filter((a) => a.status !== "已处理").map((a) => a.buildingId))
);
