import {ProcessorRowData} from "../ProcessorRowData";
import React, {useCallback, useState} from "react";
import {Button} from "antd";
import {contextPath} from "../../context";

async function startProcessor(name: string, attempt = 1) {
    const result = await fetch(`${contextPath}/processor/${name}/start`, {method: 'POST'})
    if (!result.ok) {
        if (attempt > 5) {
            return;
        }
        await startProcessor(name, attempt + 1)
    }
}


export function StartAction({row}: { row: ProcessorRowData }) {
    const [loading, setLoading] = useState(false)

    const onStartAction = useCallback(async () => {
        setLoading(true)
        await startProcessor(row.processorName)
        setLoading(false)
    }, [row.processorName])

    return <Button type="default" loading={loading} onClick={onStartAction} disabled={row.owner != null}>
        Start
    </Button>
}
