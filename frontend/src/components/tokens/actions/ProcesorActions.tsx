import {TokenOverviewData} from "../TokenOverviewData";
import React from "react";
import {StopAction} from "./StopAction";
import {StartAction} from "./StartAction";
import {Space} from "antd";
import {ReplayAction} from "./ReplayAction";

export function ProcessorActions({row}: {row: TokenOverviewData}) {
    return <Space>
        <StopAction row={row}/>
        <StartAction row={row}/>
        <ReplayAction row={row}/>
    </Space>
}
