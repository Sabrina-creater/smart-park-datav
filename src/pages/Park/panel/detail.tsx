import { useMemo } from "react";
import styled from "styled-components";
import NumberAnimation from "@/components/numberAnimation";
import Chart from "@/components/chart";
import type { ComposeOption } from "echarts/core";
import { BarChart, type BarSeriesOption } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import {
  alarms,
  buildingMap,
  buildings,
  BUILDING_PALETTE,
  BUILDING_TYPE_LABEL,
  overview,
  visitorFlow,
} from "@/data/bund";
import { useConfigStore } from "@/stores";
import { theme } from "@/theme";

type BarOption = ComposeOption<
  BarSeriesOption | GridComponentOption | TooltipComponentOption
>;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 10px;
  min-height: 0;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const Chip = styled.button<{ $color: string; $on: boolean }>`
  padding: 2px 9px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$on ? p.$color : "rgba(255,255,255,0.12)")};
  background: ${(p) => (p.$on ? `${p.$color}33` : "rgba(255,255,255,0.03)")};
  color: ${(p) => (p.$on ? theme.text : theme.textMuted)};
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${(p) => (p.$on ? `0 0 10px ${p.$color}` : "none")};

  &:hover {
    color: ${theme.text};
    border-color: ${(p) => p.$color};
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 16px;
  min-height: 0;
`;

const Info = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 12px 10px;
  align-content: center;
  min-height: 0;
`;

const Name = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: baseline;
  gap: 10px;

  b {
    font-size: 20px;
    font-weight: 600;
    color: ${theme.text};
  }

  span {
    font-size: 12px;
    color: ${theme.textMuted};
  }
`;

const Stat = styled.div<{ $color?: string }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 10px;
  border-left: 1px solid ${theme.line};
  font-size: 12px;
  color: ${theme.textMuted};

  > div {
    display: flex;
    align-items: baseline;
    gap: 3px;
    color: ${(p) => p.$color ?? theme.glow};
    font-size: 20px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  i {
    font-style: normal;
    font-size: 11px;
    color: ${theme.textMuted};
  }
`;

const ChartBox = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;

  > span {
    flex: none;
    font-size: 12px;
    color: ${theme.textMuted};
  }

  > div {
    flex: 1;
    min-height: 0;
  }
`;

/** 建筑详情：与 3D 场景联动（点击建筑 / 标签 / 告警行 / 芯片均可选中） */
export default function Detail() {
  const selected = useConfigStore((s) => s.selected);
  const select = useConfigStore((s) => s.select);
  const building = selected ? buildingMap[selected] : null;

  const openAlarms = building
    ? alarms.filter(
        (a) => a.buildingId === building.id && a.status !== "已处理"
      ).length
    : alarms.filter((a) => a.status !== "已处理").length;

  // 按建筑在场人数占比，从全域客流曲线推算该建筑 24h 客流
  const hourly = useMemo(() => {
    const ratio = building ? building.people / overview.peopleNow : 1;
    return visitorFlow.today.map((v) => Math.round(v * ratio));
  }, [building]);

  const color = building ? BUILDING_PALETTE[building.type][1] : theme.primary;

  return (
    <Wrapper>
      <Chips>
        {buildings.map((b) => (
          <Chip
            key={b.id}
            $color={BUILDING_PALETTE[b.type][1]}
            $on={b.id === selected}
            onClick={() => select(b.id)}>
            {b.name}
          </Chip>
        ))}
      </Chips>

      <Body>
        <Info>
          <Name>
            <b>{building ? building.name : "外滩全景"}</b>
            <span>
              {building
                ? `${BUILDING_TYPE_LABEL[building.type]} · ${building.height} m · ${building.floors} 层 · 建成于 ${building.builtYear} 年`
                : "点击 3D 建筑、建筑芯片或告警列表，查看建筑详情并定位镜头"}
            </span>
          </Name>
          <Stat>
            <span>{building ? "当前在场" : "实时在场"}</span>
            <div>
              <NumberAnimation
                value={building ? building.people : overview.peopleNow}
                duration={0.8}
                options={{ maximumFractionDigits: 0 }}
              />
              <i>人</i>
            </div>
          </Stat>
          <Stat $color={theme.warn}>
            <span>今日用电</span>
            <div>
              <NumberAnimation
                value={building ? building.energyToday : overview.energyToday}
                duration={0.8}
                options={{ maximumFractionDigits: 0 }}
              />
              <i>kWh</i>
            </div>
          </Stat>
          <Stat $color={openAlarms > 0 ? theme.danger : theme.success}>
            <span>未关闭告警</span>
            <div>
              <NumberAnimation
                value={openAlarms}
                duration={0.6}
                options={{ maximumFractionDigits: 0 }}
              />
              <i>
                条
                {building && ` · 运行负荷 ${Math.round(building.load * 100)}%`}
              </i>
            </div>
          </Stat>
        </Info>

        <ChartBox>
          <span>
            {building ? building.name : "外滩全域"} · 今日 24h 客流（人/时，估算）
          </span>
          <Chart<BarOption>
            use={[BarChart, GridComponent, TooltipComponent]}
            option={{
              tooltip: {
                trigger: "axis",
                backgroundColor: "rgba(4, 16, 36, 0.9)",
                borderColor: theme.line,
                textStyle: { color: theme.text, fontSize: 12 },
                valueFormatter: (v) => `${Number(v).toLocaleString()} 人`,
              },
              grid: { top: 6, bottom: 2, left: 2, right: 2, containLabel: true },
              xAxis: {
                type: "category",
                data: visitorFlow.hours,
                axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
                axisTick: { show: false },
                axisLabel: {
                  color: theme.textDim,
                  fontSize: 10,
                  interval: 3,
                  formatter: (v: string) => v.slice(0, 2),
                },
              },
              yAxis: {
                type: "value",
                splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
                axisLabel: {
                  color: theme.textDim,
                  fontSize: 10,
                  formatter: (v: number) => (v >= 1000 ? `${v / 1000}k` : `${v}`),
                },
              },
              series: [
                {
                  type: "bar",
                  name: "客流",
                  barWidth: "55%",
                  itemStyle: {
                    borderRadius: [2, 2, 0, 0],
                    color: {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        { offset: 0, color },
                        { offset: 1, color: `${color}22` },
                      ],
                    },
                  },
                  data: hourly,
                },
              ],
            }}
          />
        </ChartBox>
      </Body>
    </Wrapper>
  );
}
