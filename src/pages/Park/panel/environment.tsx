import styled from "styled-components";
import Chart from "@/components/chart";
import type { ComposeOption } from "echarts/core";
import { RadarChart, type RadarSeriesOption } from "echarts/charts";
import {
  RadarComponent,
  TooltipComponent,
  type RadarComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { environment, environmentRadar } from "@/data/bund";
import { theme } from "@/theme";

type RadarOption = ComposeOption<
  RadarSeriesOption | RadarComponentOption | TooltipComponentOption
>;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 8px;
`;

const List = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 4px;
  font-size: 12px;
  color: ${theme.textMuted};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-radius: 3px;
  background: rgba(63, 182, 255, 0.06);

  b {
    font-size: 15px;
    font-weight: 600;
    color: ${theme.glow};
    font-variant-numeric: tabular-nums;
  }

  i {
    font-style: normal;
    font-size: 10px;
    color: ${theme.textDim};
    margin-left: 3px;
  }
`;

const metrics = [
  { label: "温度", value: environment.temperature, unit: "℃" },
  { label: "湿度", value: environment.humidity, unit: "%" },
  { label: "PM2.5", value: environment.pm25, unit: "μg/m³" },
  { label: "噪音", value: environment.noise, unit: "dB" },
  { label: "江面水位", value: environment.waterLevel, unit: "m" },
  { label: "风速", value: environment.wind, unit: "m/s" },
];

/** 环境监测：舒适度雷达 + 实时指标 */
export default function Environment() {
  return (
    <Wrapper>
      <Chart<RadarOption>
        use={[RadarChart, RadarComponent, TooltipComponent]}
        option={{
          tooltip: {
            backgroundColor: "rgba(4, 16, 36, 0.9)",
            borderColor: theme.line,
            textStyle: { color: theme.text, fontSize: 12 },
          },
          radar: {
            center: ["50%", "52%"],
            radius: "68%",
            indicator: environmentRadar.map((i) => ({ name: i.name, max: i.max })),
            axisName: { color: theme.textMuted, fontSize: 10 },
            axisNameGap: 6,
            splitNumber: 4,
            splitLine: { lineStyle: { color: "rgba(63,182,255,0.18)" } },
            splitArea: {
              areaStyle: {
                color: ["rgba(63,182,255,0.02)", "rgba(63,182,255,0.06)"],
              },
            },
            axisLine: { lineStyle: { color: "rgba(63,182,255,0.18)" } },
          },
          series: [
            {
              type: "radar",
              name: "外滩环境舒适度",
              symbolSize: 4,
              data: [
                {
                  value: environmentRadar.map((i) => i.value),
                  name: "舒适度",
                  lineStyle: { color: theme.success, width: 2 },
                  itemStyle: { color: theme.success },
                  areaStyle: { color: `${theme.success}55` },
                },
              ],
            },
          ],
        }}
      />
      <List>
        {metrics.map((m) => (
          <Row key={m.label}>
            <span>{m.label}</span>
            <span>
              <b>{m.value}</b>
              <i>{m.unit}</i>
            </span>
          </Row>
        ))}
      </List>
    </Wrapper>
  );
}
