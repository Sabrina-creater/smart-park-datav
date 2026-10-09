import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { overview } from "@/data/bund";

interface ConfigState {
  /** 开场动画是否完成 */
  sceneReady: boolean;
  flyLine: boolean;
  beam: boolean;
  labels: boolean;
  vehicles: boolean;
  boats: boolean;
  autoRotate: boolean;
  /** 当前选中的建筑 id */
  selected: string | null;
  hovered: string | null;
}

interface ConfigActions {
  toggle: (key: keyof Omit<ConfigState, "selected" | "hovered">) => void;
  /** 切换选中（再次点击同一建筑取消选中） */
  select: (id: string | null) => void;
  /** 定位到建筑（不切换，始终选中） */
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
    boats: true,
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
  visitorsToday: number;
  peopleNow: number;
  energyToday: number;
  devicesOnline: number;
  tick: () => void;
}

/** 模拟实时数据：每隔几秒变化，接真实接口时替换 tick 即可 */
export const useLiveStore = create<LiveState>()((set) => ({
  visitorsToday: overview.visitorsToday,
  peopleNow: overview.peopleNow,
  energyToday: overview.energyToday,
  devicesOnline: overview.devicesOnline,
  tick: () =>
    set((s) => ({
      visitorsToday: s.visitorsToday + 8 + Math.round(Math.random() * 20),
      peopleNow: Math.max(
        Math.round(overview.peopleNow * 0.8),
        s.peopleNow + Math.round((Math.random() - 0.45) * 200)
      ),
      energyToday: s.energyToday + 6 + Math.round(Math.random() * 12),
      devicesOnline: 3850 + Math.round(Math.random() * 20),
    })),
}));
