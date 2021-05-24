import {TokenOverviewData} from "../TokenOverviewData";
import React, {useCallback, useState} from "react";
import {Button, Popover} from "antd";
import {contextPath} from "../../../context";
import {SplitCellsOutlined} from "@ant-design/icons";

async function splitProcessor(name: string, segment: number, attempt = 1) {
    const result = await fetch(`${contextPath}/processor/${name}/split/${segment}`, {method: 'POST'})
    if (!result.ok) {
        if (attempt > 5) {
            return;
        }
        await splitProcessor(name, attempt + 1)
    }
}


export function SplitAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onSplitAction = useCallback(async () => {
        setLoading(true)
        await splitProcessor(row.processorName, row.segment)
        setLoading(false)
    }, [row.processorName, row.segment])

    return <Popover content={<p>Splits the token of this segment in two, increasing active threads of the processor by one. <br/>Warning: This action might fail when there are no threads available.</p>}
                    placement={"bottom"}>
        <Button type="default" loading={loading} onClick={onSplitAction} disabled={row.owner == null}>
        <SplitCellsOutlined />
    </Button>
    </Popover>
}
