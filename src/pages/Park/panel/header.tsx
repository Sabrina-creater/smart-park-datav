import { useState, type ComponentProps } from "react";
import styled from "styled-components";
import useRafInterval from "@/hooks/useRafInterval";
import { environment } from "@/data/park";
import { theme } from "@/theme";

const Wrapper = styled.div`
  position: relative;
  flex: none;
  width: 100%;
  height: 88px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
  pointer-events: auto;

  > svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 8px;
  background: linear-gradient(to bottom, #ffffff 30%, ${theme.accent});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 12px rgba(63, 182, 255, 0.45));
`;

const Subtitle = styled.div`
  margin-top: 2px;
  font-size: 11px;
  letter-spacing: 6px;
  color: rgba(143, 211, 255, 0.6);
`;

const Side = styled.div<{ $right?: boolean }>`
  position: absolute;
  top: 18px;
  ${(p) => (p.$right ? "right: 36px;" : "left: 36px;")}
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 14px;
  color: ${theme.textMuted};
  letter-spacing: 1px;
`;

const Clock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  b {
    font-size: 22px;
    font-weight: 600;
    color: ${theme.text};
    font-variant-numeric: tabular-nums;
    letter-spacing: 2px;
  }
`;

const Weather = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border: 1px solid ${theme.line};
  border-radius: 999px;
  background: rgba(6, 20, 44, 0.5);

  b {
    color: ${theme.glow};
    font-weight: 600;
  }
`;

const Github = styled.a`
  display: flex;
  width: 30px;
  height: 30px;
  color: ${theme.text};
  opacity: 0.75;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const WEEK = ["日", "一", "二", "三", "四", "五", "六"];

function formatNow() {
  const d = new Date();
  const p = (n: number) => `${n}`.padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} 星期${
      WEEK[d.getDay()]
    }`,
    time: `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`,
  };
}

const Bg = () => (
  <svg viewBox="0 0 1920 88" preserveAspectRatio="none">
    <defs>
      <linearGradient id="hdr-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#06172f" stopOpacity="0.95" />
        <stop offset="1" stopColor="#06172f" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="hdr-line" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={theme.primary} stopOpacity="0" />
        <stop offset="0.5" stopColor={theme.primary} stopOpacity="1" />
        <stop offset="1" stopColor={theme.primary} stopOpacity="0" />
      </linearGradient>
      <radialGradient id="hdr-spot">
        <stop offset="0" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <mask id="hdr-m1">
        <circle r="120" fill="url(#hdr-spot)">
          <animateMotion
            dur="4s"
            path="M0,64 L640,64 L700,84 L960,84"
            repeatCount="indefinite"
          />
        </circle>
      </mask>
      <mask id="hdr-m2">
        <circle r="120" fill="url(#hdr-spot)">
          <animateMotion
            dur="4s"
            path="M1920,64 L1280,64 L1220,84 L960,84"
            repeatCount="indefinite"
          />
        </circle>
      </mask>
    </defs>
    <path
      d="M0,0 L1920,0 L1920,64 L1280,64 L1220,84 L700,84 L640,64 L0,64 Z"
      fill="url(#hdr-fill)"
    />
    <path
      d="M0,64 L640,64 L700,84 L1220,84 L1280,64 L1920,64"
      fill="none"
      stroke="url(#hdr-line)"
      strokeWidth="1.5"
    />
    <path
      d="M0,64 L640,64 L700,84 L960,84"
      fill="none"
      stroke={theme.glow}
      strokeWidth="3"
      mask="url(#hdr-m1)"
    />
    <path
      d="M1920,64 L1280,64 L1220,84 L960,84"
      fill="none"
      stroke={theme.glow}
      strokeWidth="3"
      mask="url(#hdr-m2)"
    />
  </svg>
);

export default function Header(props: ComponentProps<typeof Wrapper>) {
  const [now, setNow] = useState(formatNow);
  useRafInterval(() => setNow(formatNow()), 1000);

  return (
    <Wrapper {...props}>
      <Bg />
      <Side>
        <Clock>
          <b>{now.time}</b>
          <span>{now.date}</span>
        </Clock>
      </Side>
      <Title>智慧园区数字孪生运营中心</Title>
      <Subtitle>SMART PARK · DIGITAL TWIN OPERATION CENTER</Subtitle>
      <Side $right>
        <Weather>
          <span>{environment.weather}</span>
          <b>{environment.temperature}℃</b>
          <span>
            AQI {environment.aqi} · {environment.aqiLevel}
          </span>
        </Weather>
        <Github
          href="https://github.com/knight-L/sc-datav"
          target="_blank"
          rel="noreferrer"
          title="基于 sc-datav 模板">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </Github>
      </Side>
    </Wrapper>
  );
}
