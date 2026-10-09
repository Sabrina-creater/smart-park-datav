import SeamVirtualScroll from "@/components/seamVirtualScroll";
import {
  alarms,
  ALARM_LEVEL_COLOR,
  ALARM_STATUS_COLOR,
  buildingMap,
  type Alarm,
} from "@/data/bund";
import { useConfigStore } from "@/stores";
import { theme } from "@/theme";

/** 安防告警滚动列表：点击行定位到对应楼宇 */
export default function Alarms() {
  const focus = useConfigStore((s) => s.focus);

  return (
    <SeamVirtualScroll<Alarm>
      rowHeight={36}
      data={alarms}
      onRowClick={(row) => focus(row.buildingId)}
      column={[
        { title: "时间", dataIndex: "time", flex: 0.8 },
        {
          title: "位置",
          flex: 1.4,
          render: (row) => (
            <span style={{ color: theme.glow }}>
              {buildingMap[row.buildingId]?.name ?? row.buildingId}
            </span>
          ),
        },
        { title: "告警类型", dataIndex: "type", flex: 1.6 },
        {
          title: "等级",
          align: "center",
          flex: 0.7,
          render: (row) => (
            <span style={{ color: ALARM_LEVEL_COLOR[row.level] }}>
              {row.level}
            </span>
          ),
        },
        {
          title: "状态",
          align: "right",
          flex: 0.9,
          render: (row) => (
            <span style={{ color: ALARM_STATUS_COLOR[row.status] }}>
              ● {row.status}
            </span>
          ),
        },
      ]}
    />
  );
}
