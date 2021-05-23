import {ProcessorRowData} from "../ProcessorRowData";
import React from "react";
import {StopAction} from "./StopAction";
import {StartAction} from "./StartAction";
import {Space} from "antd";

export function ActionBar({row}: {row: ProcessorRowData}) {
    return <Space>
        <StopAction row={row}/>
        <StartAction row={row}/>
    </Space>
}
