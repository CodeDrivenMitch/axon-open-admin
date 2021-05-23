import {ProcessorRowData} from "../ProcessorRowData";
import React, {useCallback, useState} from "react";
import {Button} from "antd";
import {contextPath} from "../../context";

async function mergeProcessor(name: string, segment: number, attempt = 1) {
    const result = await fetch(`${contextPath}/processor/${name}/merge/${segment}`, {method: 'POST'})
    if (!result.ok) {
        if (attempt > 5) {
            return;
        }
        await mergeProcessor(name, segment, attempt + 1)
    }
}


export function MergeAction({row}: { row: ProcessorRowData }) {
    const [loading, setLoading] = useState(false)

    const onSplitAction = useCallback(async () => {
        setLoading(true)
        await mergeProcessor(row.processorName, row.segment)
        setLoading(false)
    }, [row.processorName, row.segment])

    return <Button type="default" loading={loading} onClick={onSplitAction}>
        Merge
    </Button>
}
