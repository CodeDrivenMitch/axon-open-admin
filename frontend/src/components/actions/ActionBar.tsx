import {ProcessorRowData} from "../ProcessorRowData";
import React from "react";
import {StopAction} from "./StopAction";
import {StartAction} from "./StartAction";
import {Space} from "antd";
import {SplitAction} from "./SplitAction";
import {MergeAction} from "./MergeAction";
import {ReleaseAction} from "./ReleaseAction";

export function ActionBar({row}: {row: ProcessorRowData}) {
    return <Space>
        <SplitAction row={row}/>
        <MergeAction row={row}/>
        <ReleaseAction row={row}/>
    </Space>
}
