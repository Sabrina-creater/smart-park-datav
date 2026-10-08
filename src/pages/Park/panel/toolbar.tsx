import type { ComponentProps } from "react";
import styled from "styled-components";
import { useConfigStore } from "@/stores";
import { theme } from "@/theme";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  border: 1px solid ${theme.line};
  background: rgba(6, 20, 44, 0.55);
  backdrop-filter: blur(6px);
  pointer-events: auto;
`;

const Pill = styled.button<{ $on: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 13px;
  letter-spacing: 1px;
  cursor: pointer;
  color: ${(p) => (p.$on ? theme.text : theme.textMuted)};
  background: ${(p) => (p.$on ? "rgba(63, 182, 255, 0.22)" : "transparent")};
  border-color: ${(p) => (p.$on ? theme.line : "transparent")};
  transition: all 0.2s;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => (p.$on ? theme.glow : "rgba(255,255,255,0.25)")};
    box-shadow: ${(p) => (p.$on ? `0 0 8px ${theme.glow}` : "none")};
  }

  &:hover {
    color: ${theme.text};
    background: rgba(63, 182, 255, 0.3);
  }
`;

const toggles = [
  { key: "flyLine", label: "数据飞线" },
  { key: "beam", label: "光束粒子" },
  { key: "labels", label: "楼宇标签" },
  { key: "vehicles", label: "园区车流" },
  { key: "autoRotate", label: "自动巡览" },
] as const;

export default function Toolbar(props: ComponentProps<typeof Wrapper>) {
  const state = useConfigStore();

  return (
    <Wrapper {...props}>
      {toggles.map((t) => (
        <Pill
          key={t.key}
          $on={state[t.key]}
          onClick={() => state.toggle(t.key)}>
          {t.label}
        </Pill>
      ))}
      <Pill
        $on={state.selected !== null}
        onClick={() => state.select(null)}
        title="取消选中，回到全景">
        {state.selected ? "返回全景" : "全景视角"}
      </Pill>
    </Wrapper>
  );
}
