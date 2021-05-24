import {TokenOverviewData} from "../TokenOverviewData";
import React from "react";
import {Space} from "antd";
import {SplitAction} from "./SplitAction";
import {MergeAction} from "./MergeAction";
import {ReleaseAction} from "./ReleaseAction";

export function SegmentActions({row}: {row: TokenOverviewData}) {
    return <Space>
        <SplitAction row={row}/>
        <MergeAction row={row}/>
        <ReleaseAction row={row}/>
    </Space>
}
