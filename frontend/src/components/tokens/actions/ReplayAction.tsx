import {TokenOverviewData} from "../TokenOverviewData";
import React, {useCallback, useState} from "react";
import {Button, Popconfirm, Popover} from "antd";
import {contextPath} from "../../../context";
import {DeleteOutlined} from "@ant-design/icons";

async function replayProcessor(name: string, attempt = 1) {
    const result = await fetch(`${contextPath}/processor/${name}/reset`, {method: 'POST'})
    if (!result.ok) {
        if (attempt > 5) {
            return;
        }
        await replayProcessor(name, attempt + 1)
    }
}


export function ReplayAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStopAction = useCallback(async () => {
        setLoading(true)
        await replayProcessor(row.processorName, row.segment)
        setLoading(false)
    }, [row.processorName, row.segment])

    return <Popover content={<p>Starts a replay of this processor. Will reset the tokens. First stop the processor on all nodes before taking this action</p>} placement={"bottom"}> <Popconfirm
        title={`Are you sure you want to replay ${row.processorName}?`}
        onConfirm={onStopAction}
        onCancel={onStopAction}
        okText="Yes"
        cancelText="No"
    ><Button type="default" loading={loading} disabled={row.owner != null || row.replaying}>
        <DeleteOutlined/>
    </Button>
    </Popconfirm>
    </Popover>
}
