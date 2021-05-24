import {TokenOverviewData} from "../TokenOverviewData";
import React, {useCallback, useState} from "react";
import {Button, Popover} from "antd";
import {contextPath} from "../../../context";
import {PlayCircleOutlined} from "@ant-design/icons";
import store from "../../../redux/store";
import {TokenSliceState} from "../../../redux/tokens/TokenSlice";

async function startProcessor(name: string, attempt = 1) {
    if (attempt > 10) {
        return;
    }
    const result = await fetch(`${contextPath}/processor/${name}/start`, {method: 'POST'})
    if (!result.ok) {
        await startProcessor(name, attempt + 1)
    } else {
        setTimeout(() => {
            const state = store.getState().token as TokenSliceState
            console.log(state)
            if(Object.values(state.knownNodes).find((kn) => kn.processorStates?.find(ps => ps.name === name && !ps.running))) {
                startProcessor(name, attempt + 1)
            }
        }, 2000)
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
        <Button type="default" loading={loading} onClick={onStartAction} disabled={!row.anyNodeStopped}>
            <PlayCircleOutlined/>
        </Button>
    </Popover>
}
