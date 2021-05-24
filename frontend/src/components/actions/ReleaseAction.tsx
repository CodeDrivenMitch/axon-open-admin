import {TokenOverviewData} from "../TokenOverviewData";
import React, {useCallback, useState} from "react";
import {Button, Popover} from "antd";
import {contextPath} from "../../context";
import {SwapOutlined} from "@ant-design/icons";

async function releaseSegment(name: string, segment: number, attempt = 1) {
    const result = await fetch(`${contextPath}/processor/${name}/release/${segment}`, {method: 'POST'})
    if (!result.ok) {
        if (attempt > 5) {
            return;
        }
        await releaseSegment(name, attempt + 1)
    }
}


export function ReleaseAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onReleaseAction = useCallback(async () => {
        setLoading(true)
        await releaseSegment(row.processorName, row.segment)
        setLoading(false)
    }, [row.processorName, row.segment])

    return <Popover content="Releases this segment on the running node so another node can pick it up"
                    placement={"bottom"}>
        <Button type="default" loading={loading}
                onClick={onReleaseAction}
                disabled={row.owner == null}>
            <SwapOutlined/>
        </Button>
    </Popover>
}
