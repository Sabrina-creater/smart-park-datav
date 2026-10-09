import Chart from "@/components/chart";
import type { ComposeOption } from "echarts/core";
import { PieChart, type PieSeriesOption } from "echarts/charts";
import {
  GraphicComponent,
  LegendComponent,
  TooltipComponent,
  type GraphicComponentOption,
  type LegendComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { industries, overview } from "@/data/bund";
import { theme } from "@/theme";

type PieOption = ComposeOption<
  | PieSeriesOption
  | TooltipComponentOption
  | LegendComponentOption
  | GraphicComponentOption
>;

/** 业态分布环图（入驻商户） */
export default function Business() {
  return (
    <Chart<PieOption>
      use={[PieChart, TooltipComponent, LegendComponent, GraphicComponent]}
      option={{
        color: [...theme.series],
        tooltip: {
          backgroundColor: "rgba(4, 16, 36, 0.9)",
          borderColor: theme.line,
          textStyle: { color: theme.text, fontSize: 12 },
          formatter: "{b}<br/>{c} 家 · {d}%",
        },
        legend: {
          orient: "vertical",
          right: 0,
          top: "middle",
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 12,
          icon: "circle",
          textStyle: { color: theme.textMuted, fontSize: 12 },
          formatter: (name) => {
            const item = industries.find((i) => i.name === name);
            return `${name}  ${item?.value ?? 0} 家`;
          },
        },
        graphic: {
          elements: [
            {
              type: "text",
              left: "22%",
              top: "40%",
              style: {
                text: `${overview.merchants}`,
                fill: theme.text,
                fontSize: 26,
                fontWeight: 700,
                align: "center",
              },
            },
            {
              type: "text",
              left: "22%",
              top: "58%",
              style: {
                text: "入驻商户",
                fill: theme.textMuted,
                fontSize: 11,
                align: "center",
              },
            },
          ],
        },
        series: [
          {
            type: "pie",
            center: ["29%", "50%"],
            radius: ["58%", "80%"],
            roseType: "area",
            padAngle: 3,
            itemStyle: { borderRadius: 4 },
            label: { show: false },
            emphasis: {
              scale: true,
              scaleSize: 6,
              label: { show: false },
            },
            data: industries,
          },
        ],
      }}
    />
  );
}
