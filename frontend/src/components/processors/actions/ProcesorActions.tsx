import {Space} from "antd";
import React from "react";
import {ProcessorOverviewData} from "../ProcessorOverviewData";
import {MergeAction} from "./MergeAction";
import {ReplayAction} from "./ReplayAction";
import {SplitAction} from "./SplitAction";
import {StartAction} from "./StartAction";
import {StopAction} from "./StopAction";

export function ProcessorActions({row}: { row: ProcessorOverviewData }) {
    return <Space>
        <StopAction row={row}/>
        <StartAction row={row}/>
        <ReplayAction row={row}/>
        <SplitAction row={row}/>
        <MergeAction row={row}/>
    </Space>
}
