import styled, { keyframes } from "styled-components";
import { theme } from "@/theme";

const pulse = keyframes`
  0%, 100% { opacity: 0.35; transform: scaleX(0.6); }
  50% { opacity: 1; transform: scaleX(1); }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: ${theme.bg};
  color: ${theme.textMuted};
  letter-spacing: 6px;
  font-size: 14px;
`;

const Bar = styled.div`
  width: 160px;
  height: 2px;
  background: linear-gradient(90deg, transparent, ${theme.primary}, transparent);
  animation: ${pulse} 1.6s ease-in-out infinite;
`;

export default function Loading() {
  return (
    <Wrapper>
      <Bar />
      <span>园区数据加载中</span>
    </Wrapper>
  );
}
