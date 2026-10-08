import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ConfigState {
  /** 开场动画是否完成 */
  sceneReady: boolean;
  flyLine: boolean;
  beam: boolean;
  labels: boolean;
  vehicles: boolean;
  autoRotate: boolean;
  /** 当前选中的楼宇 id */
  selected: string | null;
  hovered: string | null;
}

interface ConfigActions {
  toggle: (key: keyof Omit<ConfigState, "selected" | "hovered">) => void;
  /** 切换选中（再次点击同一楼宇取消选中） */
  select: (id: string | null) => void;
  /** 定位到楼宇（不切换，始终选中） */
  focus: (id: string) => void;
  hover: (id: string | null) => void;
  reset: () => void;
}

export type ConfigStore = ConfigState & ConfigActions;

export const useConfigStore = create<ConfigStore>()(
  subscribeWithSelector((set, get, store) => ({
    sceneReady: false,
    flyLine: true,
    beam: true,
    labels: true,
    vehicles: true,
    autoRotate: false,
    selected: null,
    hovered: null,
    toggle: (key) => set((s) => ({ [key]: !s[key] })),
    select: (id) => set({ selected: get().selected === id ? null : id }),
    focus: (id) => set({ selected: id }),
    hover: (id) => set({ hovered: id }),
    reset: () => set(store.getInitialState()),
  }))
);

interface LiveState {
  energyToday: number;
  vehiclesIn: number;
  vehiclesOut: number;
  onlineDevices: number;
  tick: () => void;
}

/** 模拟实时数据：每隔几秒自增，接真实接口时替换 tick 即可 */
export const useLiveStore = create<LiveState>()((set) => ({
  energyToday: 8642,
  vehiclesIn: 934,
  vehiclesOut: 915,
  onlineDevices: 2186,
  tick: () =>
    set((s) => ({
      energyToday: s.energyToday + 2 + Math.round(Math.random() * 5),
      vehiclesIn: s.vehiclesIn + (Math.random() > 0.55 ? 1 : 0),
      vehiclesOut: s.vehiclesOut + (Math.random() > 0.6 ? 1 : 0),
      onlineDevices: 2180 + Math.round(Math.random() * 12),
    })),
}));
