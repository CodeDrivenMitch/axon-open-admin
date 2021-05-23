import {ProcessorRowData} from "../ProcessorRowData";
import React, {useCallback, useState} from "react";
import {Button} from "antd";
import {contextPath} from "../../context";

async function stopProcessor(name: string, attempt = 1) {
    const result = await fetch(`${contextPath}/processor/${name}/stop`, {method: 'POST'})
    if (!result.ok) {
        if (attempt > 5) {
            return;
        }
        await stopProcessor(name, attempt + 1)
    }
}


export function StopAction({row}: { row: ProcessorRowData }) {
    const [loading, setLoading] = useState(false)

    const onStopAction = useCallback(async () => {
        setLoading(true)
        await stopProcessor(row.processorName, row.segment)
        setLoading(false)
    }, [row.key])

    return <Button type="default" loading={loading} onClick={onStopAction} disabled={row.owner == null}>
        Stop
    </Button>
}
