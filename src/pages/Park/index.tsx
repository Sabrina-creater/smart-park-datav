import { useEffect } from "react";
import styled from "styled-components";
import { useConfigStore, useLiveStore } from "@/stores";
import useRafInterval from "@/hooks/useRafInterval";
import Scene from "./scene";
import Panel from "./panel";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

export default function Park() {
  useEffect(() => () => useConfigStore.getState().reset(), []);

  // 模拟实时数据刷新
  useRafInterval(() => useLiveStore.getState().tick(), 3000);

  return (
    <Wrapper>
      <Scene />
      <Panel />
    </Wrapper>
  );
}
