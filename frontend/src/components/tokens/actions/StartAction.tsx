import {TokenOverviewData} from "../TokenOverviewData";
import React, {useCallback, useState} from "react";
import {Button, Popover} from "antd";
import {contextPath} from "../../../context";
import {PlayCircleOutlined} from "@ant-design/icons";

async function startProcessor(name: string, attempt = 1) {
    const result = await fetch(`${contextPath}/processor/${name}/start`, {method: 'POST'})
    if (!result.ok) {
        if (attempt > 5) {
            return;
        }
        await startProcessor(name, attempt + 1)
    }
}


export function StartAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStartAction = useCallback(async () => {
        setLoading(true)
        await startProcessor(row.processorName)
        setLoading(false)
    }, [row.processorName])

    return <Popover content={<p>Starts the processor.</p>}
                    placement={"bottom"}>
        <Button type="default" loading={loading} onClick={onStartAction} disabled={!row.processorHasUnclaimed}>
            <PlayCircleOutlined/>
        </Button>
    </Popover>
}
