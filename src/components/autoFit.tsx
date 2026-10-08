import { useLayoutEffect, useRef, type ComponentProps } from "react";
import styled from "styled-components";
import autofit from "autofit.js";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

export type AutoFitProps = Omit<ComponentProps<typeof Wrapper>, "id"> & {
  /** 设计稿尺寸，默认 1920 × 1080 */
  designWidth?: number;
  designHeight?: number;
};

/** 基于 autofit.js 的等比缩放容器：按设计稿尺寸开发，自动适配任意分辨率 */
export default function AutoFit(props: AutoFitProps) {
  const { designWidth = 1920, designHeight = 1080, ...rest } = props;
  const id = useRef(`autofit_${Math.random().toString(36).slice(2)}`).current;

  useLayoutEffect(() => {
    autofit.init({ el: `#${id}`, dw: designWidth, dh: designHeight });

    return () => {
      autofit.off();
    };
  }, [id, designWidth, designHeight]);

  return <Wrapper id={id} {...rest} />;
}
