import { Html } from "@react-three/drei";
import styled from "styled-components";
import { useConfigStore } from "@/stores";
import { BUILDING_TYPE_LABEL, type Building } from "@/data/bund";
import { labelTop } from "./shapes";
import { theme } from "@/theme";

const Tag = styled.div<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
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
  if (!show || !(building.label || active)) return null;

  const top = labelTop(building);

  return (
    <Html
      center
      position={[0, top + 1.2, 0]}
      zIndexRange={[active ? 60 : 40, 0]}
      style={{ pointerEvents: "none" }}>
      <Tag $active={active}>
        <strong>{building.name}</strong>
        <Type>
          {BUILDING_TYPE_LABEL[building.type]} · {building.height} m
        </Type>
        {active && (
          <Detail>
            <span>
              建成 <b>{building.builtYear}</b> 年
            </span>
            <span>
              楼层 <b>{building.floors}</b> 层
            </span>
            <span>
              在场 <b>{building.people.toLocaleString()}</b> 人
            </span>
            <span>
              今日用电 <b>{building.energyToday.toLocaleString()}</b> kWh
            </span>
          </Detail>
        )}
      </Tag>
    </Html>
  );
}
