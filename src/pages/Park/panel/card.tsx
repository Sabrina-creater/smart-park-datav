import type { HTMLAttributes, ReactNode, Ref } from "react";
import styled from "styled-components";
import { theme } from "@/theme";

const Frame = styled.div`
  position: relative;
  min-height: 0;
  pointer-events: auto;

  > svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`;

const Body = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: ${theme.cardBg};
  backdrop-filter: blur(6px);
  clip-path: polygon(
    0 4%,
    3.5% 0,
    73% 0,
    79% 5%,
    100% 5%,
    100% 100%,
    0 100%
  );
`;

const Title = styled.div`
  position: relative;
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 18px;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${theme.text};
  border-bottom: 1px solid ${theme.line};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 44px;
    height: 3px;
    background: linear-gradient(90deg, ${theme.glow}, transparent);
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: -2px;
    width: 4px;
    height: 4px;
    border-radius: 2px;
    background: ${theme.glow};
    box-shadow: 0 0 6px ${theme.glow};
  }
`;

const Subtitle = styled.span`
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 2px;
  color: ${theme.textDim};
  text-transform: uppercase;
`;

const Extra = styled.span`
  margin-left: auto;
  font-size: 12px;
  font-weight: 400;
  color: ${theme.textMuted};
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  padding: 12px 18px 14px;
`;

const FrameSvg = () => (
  <svg fill="none" viewBox="0 0 260 180" preserveAspectRatio="none">
    <path
      fill={theme.primary}
      fillOpacity={0.9}
      fillRule="evenodd"
      d="M206 10 190 0H9L0 9v171h45l4.5-4h161l4.5 4h45V10h-54Zm53 1h-53.287l-16-10H9.414L1 9.414V179h43.62l4.5-4h161.76l4.5 4H259V11Z"
    />
    <path fill={theme.glow} d="m51 178-2 2h162l-2-2H51ZM0 0v7l7-7H0Z" />
    <path
      stroke={theme.glow}
      strokeWidth={2}
      d="M1 169v10h10M259 21V11h-10"
    />
  </svg>
);

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  ref?: Ref<HTMLDivElement>;
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}

export default function Card(props: CardProps) {
  const { title, subtitle, extra, children, ...rest } = props;
  return (
    <Frame {...rest}>
      <Body>
        <Title>
          <span>{title}</span>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          {extra && <Extra>{extra}</Extra>}
        </Title>
        <Content>{children}</Content>
      </Body>
      <FrameSvg />
    </Frame>
  );
}
