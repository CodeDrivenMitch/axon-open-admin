import {PauseOutlined} from "@ant-design/icons";
import {Button, Popover} from "antd";
import React, {useCallback, useState} from "react";
import {executeCommands} from "../commands/CommandExecutor";
import {StopCommand} from "../commands/Commands";
import {TokenOverviewData} from "../TokenOverviewData";


export function StopAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStopAction = useCallback(async () => {
        setLoading(true)
        await executeCommands(
            row.allNodes.map(owner => new StopCommand(owner, row.processorName))
        )
        setLoading(false)
    }, [row.processorName, row.allNodes])

    return <Popover
        content={<p>Pauses the processor.</p>}
        placement={"bottom"}>
        <Button type="default" loading={loading} onClick={onStopAction} disabled={!row.anyNodeRunning}>
            <PauseOutlined/>
        </Button>
    </Popover>
}
