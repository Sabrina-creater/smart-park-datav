import { useRef } from "react";
import Chart from "@/components/chart";
import useRafInterval from "@/hooks/useRafInterval";
import type { ComposeOption, EChartsType } from "echarts/core";
import { BarChart, type BarSeriesOption } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { traffic } from "@/data/park";
import { theme } from "@/theme";

type BarOption = ComposeOption<
  | BarSeriesOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
>;

const gradient = (color: string): BarSeriesOption["itemStyle"] => ({
  borderRadius: [3, 3, 0, 0],
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
});

/** 车辆进出统计（每 2 小时），提示框自动轮播 */
export default function Traffic() {
  const chartRef = useRef<EChartsType>(null);
  const tipIndex = useRef(0);

  useRafInterval(
    () => {
      chartRef.current?.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: tipIndex.current,
      });
      tipIndex.current = (tipIndex.current + 1) % traffic.slots.length;
    },
    3000,
    true
  );

  return (
    <Chart<BarOption>
      ref={chartRef}
      use={[BarChart, TooltipComponent, GridComponent, LegendComponent]}
      option={{
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(4, 16, 36, 0.9)",
          borderColor: theme.line,
          textStyle: { color: theme.text, fontSize: 12 },
          axisPointer: {
            type: "shadow",
            shadowStyle: { color: "rgba(63, 182, 255, 0.08)" },
          },
          valueFormatter: (v) => `${v} 辆`,
        },
        legend: {
          right: 0,
          top: 0,
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { color: theme.textMuted, fontSize: 12 },
        },
        grid: { top: 30, bottom: 4, left: 4, right: 8, containLabel: true },
        xAxis: {
          type: "category",
          data: traffic.slots.map((s) => `${s}:00`),
          axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
          axisTick: { show: false },
          axisLabel: { color: theme.textMuted, fontSize: 11, interval: 1 },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } },
          axisLabel: { color: theme.textMuted, fontSize: 11 },
        },
        series: [
          {
            name: "进场",
            type: "bar",
            barWidth: 8,
            itemStyle: gradient(theme.series[0]),
            data: traffic.in,
          },
          {
            name: "出场",
            type: "bar",
            barWidth: 8,
            itemStyle: gradient(theme.series[3]),
            data: traffic.out,
          },
        ],
      }}
    />
  );
}
