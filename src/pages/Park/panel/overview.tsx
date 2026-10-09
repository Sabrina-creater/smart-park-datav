import styled from "styled-components";
import NumberAnimation from "@/components/numberAnimation";
import { overview } from "@/data/bund";
import { useLiveStore } from "@/stores";
import { theme } from "@/theme";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr auto;
  grid-template-columns: 1fr 1fr;
  gap: 10px 14px;
`;

const Tile = styled.div<{ $color: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px 8px 14px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(63, 182, 255, 0.12),
    rgba(63, 182, 255, 0.02)
  );
  border-left: 2px solid ${(p) => p.$color};

  &::after {
    content: "";
    position: absolute;
    right: 8px;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    box-shadow: 0 0 8px ${(p) => p.$color};
  }
`;

const Label = styled.div`
  font-size: 12px;
  color: ${theme.textMuted};
  letter-spacing: 1px;
`;

const Value = styled.div<{ $color: string }>`
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: ${(p) => p.$color};
  text-shadow: 0 0 12px ${(p) => p.$color}66;

  > div {
    font-size: 26px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  span {
    font-size: 11px;
    color: ${theme.textMuted};
    text-shadow: none;
  }
`;

const Bars = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: ${theme.textMuted};
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr 76px;
  align-items: center;
  gap: 10px;

  i {
    display: block;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  i::after {
    content: "";
    display: block;
    height: 100%;
    width: var(--w);
    border-radius: 3px;
    background: linear-gradient(90deg, ${theme.primary}, ${theme.glow});
    box-shadow: 0 0 8px ${theme.primary};
    transition: width 1.2s ease-out;
  }

  b {
    text-align: right;
    color: ${theme.text};
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
`;

export default function Overview() {
  const live = useLiveStore();

  const tiles = [
    { label: "今日客流", value: live.visitorsToday, unit: "人次", color: theme.series[0] },
    { label: "实时在场", value: live.peopleNow, unit: "人", color: theme.series[1] },
    { label: "今日用电", value: live.energyToday, unit: "kWh", color: theme.series[3] },
    { label: "在线设备", value: live.devicesOnline, unit: "台", color: theme.series[2] },
  ];

  const bars = [
    { label: "景区承载率", value: overview.capacity, text: `${Math.round(overview.capacity * 100)}%` },
    { label: "停车位", value: overview.parkingUsed / overview.parkingTotal, text: `${overview.parkingUsed}/${overview.parkingTotal}` },
    { label: "游船上座率", value: overview.boatOccupancy, text: `${Math.round(overview.boatOccupancy * 100)}%` },
  ];

  return (
    <Wrapper>
      {tiles.map((t) => (
        <Tile key={t.label} $color={t.color}>
          <Label>{t.label}</Label>
          <Value $color={t.color}>
            <NumberAnimation
              value={t.value}
              duration={1.6}
              options={{ maximumFractionDigits: 0 }}
            />
            <span>{t.unit}</span>
          </Value>
        </Tile>
      ))}
      <Bars>
        {bars.map((b) => (
          <BarRow key={b.label}>
            <span>{b.label}</span>
            <i style={{ "--w": `${b.value * 100}%` } as React.CSSProperties} />
            <b>{b.text}</b>
          </BarRow>
        ))}
      </Bars>
    </Wrapper>
  );
}
