import { useEffect } from "react";
import styled from "styled-components";
import useMoveTo from "@/hooks/useMoveTo";
import AutoFit from "@/components/autoFit";
import { useConfigStore } from "@/stores";

import Header from "./header";
import Toolbar from "./toolbar";
import Card from "./card";
import Overview from "./overview";
import Flow from "./flow";
import Traffic from "./traffic";
import Environment from "./environment";
import Business from "./business";
import Alarms from "./alarms";
import Detail from "./detail";

const GridWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 440px 1fr 1fr 440px;
  grid-template-rows: repeat(6, minmax(0, 1fr));
  gap: 16px;
  padding: 12px 20px 20px;
`;

const ToolbarSlot = styled.div`
  grid-area: 1 / 2 / 2 / 4;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export default function Panel() {
  const top = useMoveTo<HTMLDivElement>("toBottom", 0.6);
  const left0 = useMoveTo<HTMLDivElement>("toRight", 0.8, 0.3);
  const left1 = useMoveTo<HTMLDivElement>("toRight", 0.8, 0.45);
  const left2 = useMoveTo<HTMLDivElement>("toRight", 0.8, 0.6);
  const right0 = useMoveTo<HTMLDivElement>("toLeft", 0.8, 0.3);
  const right1 = useMoveTo<HTMLDivElement>("toLeft", 0.8, 0.45);
  const right2 = useMoveTo<HTMLDivElement>("toLeft", 0.8, 0.6);
  const bottom = useMoveTo<HTMLDivElement>("toTop", 0.8, 0.7);
  const toolbar = useMoveTo<HTMLDivElement>("toBottom", 0.6, 0.8);

  useEffect(() => {
    const boxes = [top, left0, left1, left2, right0, right1, right2, bottom, toolbar];
    return useConfigStore.subscribe(
      (s) => s.sceneReady,
      (ready) => {
        if (ready) boxes.forEach((b) => b.restart());
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AutoFit>
      <Header ref={top.ref} />
      <GridWrapper>
        <ToolbarSlot>
          <Toolbar ref={toolbar.ref} />
        </ToolbarSlot>

        <Card
          ref={left0.ref}
          style={{ gridArea: "1 / 1 / 3 / 2" }}
          title="外滩概况"
          subtitle="Overview">
          <Overview />
        </Card>
        <Card
          ref={left1.ref}
          style={{ gridArea: "3 / 1 / 5 / 2" }}
          title="客流监测"
          subtitle="Visitor Flow"
          extra="单位：人/时">
          <Flow />
        </Card>
        <Card
          ref={left2.ref}
          style={{ gridArea: "5 / 1 / 7 / 2" }}
          title="车辆通行"
          subtitle="Traffic"
          extra="中山东一路 · 今日">
          <Traffic />
        </Card>

        <Card
          ref={right0.ref}
          style={{ gridArea: "1 / 4 / 3 / 5" }}
          title="环境监测"
          subtitle="Environment">
          <Environment />
        </Card>
        <Card
          ref={right1.ref}
          style={{ gridArea: "3 / 4 / 5 / 5" }}
          title="业态分布"
          subtitle="Business">
          <Business />
        </Card>
        <Card
          ref={right2.ref}
          style={{ gridArea: "5 / 4 / 7 / 5" }}
          title="安防告警"
          subtitle="Alarms"
          extra="点击定位">
          <Alarms />
        </Card>

        <Card
          ref={bottom.ref}
          style={{ gridArea: "5 / 2 / 7 / 4" }}
          title="建筑详情"
          subtitle="Building">
          <Detail />
        </Card>
      </GridWrapper>
    </AutoFit>
  );
}
