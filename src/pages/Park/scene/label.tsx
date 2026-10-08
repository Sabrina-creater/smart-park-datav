import { Html } from "@react-three/drei";
import styled from "styled-components";
import { useConfigStore } from "@/stores";
import { BUILDING_TYPE_LABEL, type Building } from "@/data/park";
import { theme } from "@/theme";

const Tag = styled.div<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.25;
  white-space: nowrap;
  color: ${theme.text};
  background: ${({ $active }) =>
    $active ? "rgba(63, 182, 255, 0.35)" : "rgba(4, 16, 36, 0.72)"};
  border: 1px solid
    ${({ $active }) => ($active ? theme.glow : "rgba(63, 182, 255, 0.45)")};
  box-shadow: ${({ $active }) =>
    $active ? `0 0 14px ${theme.primary}` : "none"};
  backdrop-filter: blur(4px);
  transform: translateY(-50%);
  transition: background 0.2s, box-shadow 0.2s;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 100%;
    width: 1px;
    height: 10px;
    background: linear-gradient(to bottom, ${theme.primary}, transparent);
  }
`;

const Type = styled.span`
  font-size: 10px;
  color: ${theme.textMuted};
  letter-spacing: 1px;
`;

const Detail = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 2px 10px;
  margin-top: 2px;
  padding-top: 4px;
  border-top: 1px dashed rgba(255, 255, 255, 0.25);
  font-size: 11px;
  color: ${theme.textMuted};

  b {
    color: ${theme.glow};
    font-weight: 600;
  }
`;

export interface LabelProps {
  building: Building;
  active: boolean;
}

export default function Label({ building, active }: LabelProps) {
  const show = useConfigStore((s) => s.sceneReady && s.labels);
  if (!show) return null;

  const [, h] = building.size;

  return (
    <Html
      center
      position={[0, h + 0.8, 0]}
      distanceFactor={34}
      zIndexRange={[active ? 60 : 40, 0]}
      style={{ pointerEvents: "none" }}>
      <Tag $active={active}>
        <strong>{building.name}</strong>
        <Type>{BUILDING_TYPE_LABEL[building.type]}</Type>
        {active && (
          <Detail>
            <span>
              入驻企业 <b>{building.companies}</b> 家
            </span>
            <span>
              人员 <b>{building.people.toLocaleString()}</b> 人
            </span>
            <span>
              今日用电 <b>{building.energyToday.toLocaleString()}</b> kWh
            </span>
            <span>
              入驻率 <b>{Math.round(building.occupancy * 100)}%</b>
            </span>
          </Detail>
        )}
      </Tag>
    </Html>
  );
}
