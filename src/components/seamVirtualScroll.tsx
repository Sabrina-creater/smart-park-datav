import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import useAnimationFrame from "@/hooks/useAnimationFrame";
import useSize from "@/hooks/useSize";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transform: translate3d(0px, 0px, 0px);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
`;

const Table = styled.div`
  flex: 1 1 0;
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const TableContent = styled.div`
  color: #ffffff;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding-inline: 0.5rem;
  font-size: 0.8rem;
  line-height: 1.25rem;
  height: 34px;
  color: rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Cell = styled.div<{
  $align?: "left" | "right" | "center";
  $flex?: number;
}>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${(props) => ({
    textAlign: props.$align ?? "left",
    flex: props.$flex ?? 1,
  })}
`;

const BodyRowWrapper = styled.div<{ $height: number; $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  line-height: 1.25rem;
  padding-inline: 0.5rem;
  margin: 2px 0;
  border-radius: 2px;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  transition: background 0.2s;

  &:nth-child(odd) {
    background: rgba(63, 182, 255, 0.06);
  }

  &:hover {
    background: rgba(63, 182, 255, 0.18);
  }

  ${(props) => ({
    height: `${props.$height}px`,
  })}
`;

const Empty = styled.div.attrs({ children: "暂无数据" })`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
`;

export interface Column<T> {
  title?: string;
  dataIndex?: keyof T;
  align?: "center" | "left" | "right";
  flex?: number;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface SeamVirtualScrollProps<T> {
  data?: T[];
  column?: Column<T>[];
  /** 滚动间隔 ms */
  speed?: number;
  rowHeight?: number;
  onRowClick?: (row: T, index: number) => void;
  styles?: {
    header?: React.CSSProperties;
    body?: React.CSSProperties;
  };
}

/** 无缝滚动表格：数据超出容器高度时自动循环上滚，悬停暂停 */
export default function SeamVirtualScroll<T extends object>(
  props: SeamVirtualScrollProps<T>
) {
  const {
    speed = 2500,
    rowHeight = 40,
    column = [],
    data = [],
    styles,
    onRowClick,
  } = props;
  const lastTime = useRef<number>(0);
  const warper = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { height: warperHeight = 0 } = useSize(warper) ?? {};
  const [isScroll, setIsScroll] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isScrollHeight, len, list] = useMemo(() => {
    const rowH = rowHeight + 4;
    const canScroll = data.length * rowH > warperHeight && warperHeight > 0;
    const visible = Math.ceil(warperHeight / rowH);
    return [
      canScroll,
      visible,
      canScroll ? data.concat(data.slice(0, visible)) : data,
    ];
  }, [data, rowHeight, warperHeight]);

  const renderList = useMemo(() => {
    contentRef.current?.style.setProperty("transform", "translate3d(0, 0, 0)");
    contentRef.current?.style.setProperty("transition", "none");
    return list.slice(activeIndex, activeIndex + len);
  }, [activeIndex, list, len]);

  useAnimationFrame((timestamp: number) => {
    if (timestamp - lastTime.current >= speed) {
      contentRef.current?.style.setProperty(
        "transform",
        `translate3d(0, ${-(rowHeight + 4)}px, 0)`
      );
      contentRef.current?.style.setProperty(
        "transition",
        "transform 300ms ease-in 0s"
      );
      lastTime.current = timestamp;
    }
  }, isScroll && isScrollHeight);

  const onTransitionEnd = () => {
    setActiveIndex((n) => (n + 1) % data.length);
  };

  return (
    <Wrapper
      onMouseEnter={() => setIsScroll(false)}
      onMouseLeave={() => setIsScroll(true)}>
      <HeaderWrapper style={styles?.header}>
        {column.map((el, idx) => (
          <Cell $align={el.align} $flex={el.flex} key={idx}>
            {el.title}
          </Cell>
        ))}
      </HeaderWrapper>

      <Table ref={warper}>
        <TableContent
          ref={contentRef}
          style={styles?.body}
          onTransitionEnd={onTransitionEnd}>
          {renderList.map((item, idx) => {
            const dataIndex = (idx + activeIndex) % data.length;
            return (
              <BodyRowWrapper
                key={idx + activeIndex}
                $height={rowHeight}
                $clickable={!!onRowClick}
                onClick={() => onRowClick?.(item, dataIndex)}>
                {column.map((el, cIdx) => (
                  <Cell $align={el.align} $flex={el.flex} key={cIdx}>
                    {el.render
                      ? el.render(item, dataIndex)
                      : (item[el.dataIndex as keyof T] as React.ReactNode)}
                  </Cell>
                ))}
              </BodyRowWrapper>
            );
          })}
        </TableContent>
        {!(renderList.length > 0) && <Empty />}
      </Table>
    </Wrapper>
  );
}
