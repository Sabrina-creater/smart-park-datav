import { useRef } from "react";
import Chart from "@/components/chart";
import useRafInterval from "@/hooks/useRafInterval";
import type { ComposeOption, EChartsType } from "echarts/core";
import { LineChart, type LineSeriesOption } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  TooltipComponent,
  type DataZoomComponentOption,
  type GridComponentOption,
  type LegendComponentOption,
  type MarkPointComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { visitorFlow } from "@/data/bund";
import { theme } from "@/theme";

type LineOption = ComposeOption<
  | LineSeriesOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DataZoomComponentOption
  | MarkPointComponentOption
>;

const WINDOW = 10;
const colors = [theme.series[0], theme.series[1]];

const makeSeries = (
  name: string,
  data: number[],
  color: string,
  withMark = false
): LineSeriesOption => ({
  name,
  type: "line",
  symbol: "none",
  smooth: true,
  lineStyle: { width: 2, color },
  itemStyle: { color },
  areaStyle: {
    color: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: `${color}99` },
        { offset: 1, color: `${color}05` },
      ],
    },
  },
  markPoint: withMark
    ? {
        symbol: "rect",
        symbolSize: [64, 20],
        symbolOffset: [0, -12],
        itemStyle: { color: `${color}cc` },
        label: { color: "#fff", fontSize: 11, formatter: "峰值 {c}" },
        data: [{ type: "max", name: "峰值" }],
      }
    : undefined,
  data,
});

/** 24 小时客流：今日 vs 昨日，窗口自动滚动 */
export default function Flow() {
  const chartRef = useRef<EChartsType>(null);
  const start = useRef(0);

  useRafInterval(() => {
    chartRef.current?.dispatchAction({
      type: "dataZoom",
      startValue: start.current,
      endValue: start.current + WINDOW,
    });
    start.current = (start.current + 1) % (visitorFlow.hours.length - WINDOW);
  }, 2500);

  return (
    <Chart<LineOption>
      ref={chartRef}
      use={[
        LineChart,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        DataZoomComponent,
        MarkPointComponent,
      ]}
      option={{
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(4, 16, 36, 0.9)",
          borderColor: theme.line,
          textStyle: { color: theme.text, fontSize: 12 },
          valueFormatter: (v) => `${Number(v).toLocaleString()} 人`,
        },
        legend: {
          right: 0,
          top: 0,
          itemWidth: 12,
          itemHeight: 4,
          textStyle: { color: theme.textMuted, fontSize: 12 },
        },
        grid: { top: 30, bottom: 4, left: 4, right: 8, containLabel: true },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: visitorFlow.hours,
          axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
          axisTick: { show: false },
          axisLabel: { color: theme.textMuted, fontSize: 11 },
        },
        yAxis: {
          type: "value",
          name: "人/时",
          nameTextStyle: { color: theme.textDim, align: "right" },
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } },
          axisLabel: {
            color: theme.textMuted,
            fontSize: 11,
            formatter: (v: number) => (v >= 1000 ? `${v / 1000}k` : `${v}`),
          },
        },
        dataZoom: {
          type: "slider",
          show: false,
          realtime: true,
          startValue: 0,
          endValue: WINDOW,
        },
        series: [
          makeSeries("今日", visitorFlow.today, colors[0], true),
          makeSeries("昨日", visitorFlow.yesterday, colors[1]),
        ],
      }}
    />
  );
}
