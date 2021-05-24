import {TokenOverviewData} from "../TokenOverviewData";
import React, {useCallback, useState} from "react";
import {Button, Popover} from "antd";
import {contextPath} from "../../context";
import {PauseOutlined} from "@ant-design/icons";

async function stopProcessor(name: string, attempt = 1) {
    const result = await fetch(`${contextPath}/processor/${name}/stop`, {method: 'POST'})
    if (!result.ok) {
        if (attempt > 5) {
            return;
        }
        await stopProcessor(name, attempt + 1)
    }
}


export function StopAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStopAction = useCallback(async () => {
        setLoading(true)
        await stopProcessor(row.processorName, row.segment)
        setLoading(false)
    }, [row.processorName, row.segment])

    return <Popover content={<p>Pauses the processor. Might need multiple tries if multiple nodes have the processor.</p>} placement={"bottom"}>
        <Button type="default" loading={loading} onClick={onStopAction} disabled={row.owner == null}>
            <PauseOutlined/>
        </Button>
    </Popover>
}
