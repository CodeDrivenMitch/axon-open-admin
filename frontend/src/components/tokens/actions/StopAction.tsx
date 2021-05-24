import {TokenOverviewData} from "../TokenOverviewData";
import React, {useCallback, useState} from "react";
import {Button, Popover} from "antd";
import {contextPath} from "../../../context";
import {PauseOutlined} from "@ant-design/icons";
import {TokenSliceState} from "../../../redux/tokens/TokenSlice";
import store from "../../../redux/store";

async function stopProcessor(name: string, attempt = 1) {
    if (attempt > 10) {
        return;
    }
    const result = await fetch(`${contextPath}/processor/${name}/stop`, {method: 'POST'})
    if (!result.ok) {
        await stopProcessor(name, attempt + 1)
    } else {
        setTimeout(() => {
            const state = store.getState().token as TokenSliceState
            console.log(state)
            if(Object.values(state.knownNodes).find((kn) => kn.processorStates?.find(ps => ps.name === name && ps.running))) {
                stopProcessor(name, attempt + 1)
            }
        }, 2000)
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
        <Button type="default" loading={loading} onClick={onStopAction} disabled={!row.anyNodeRunning}>
            <PauseOutlined/>
        </Button>
    </Popover>
}
