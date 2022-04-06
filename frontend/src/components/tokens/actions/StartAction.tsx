import {PlayCircleOutlined} from "@ant-design/icons";
import {Button, Popover} from "antd";
import React, {useCallback, useState} from "react";
import {executeCommands} from "../commands/CommandExecutor";
import {StartCommand} from "../commands/Commands";
import {TokenOverviewData} from "../TokenOverviewData";

export function StartAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStartAction = useCallback(async () => {
        setLoading(true)
        await executeCommands(
            row.allNodes.map(owner => new StartCommand(owner, row.processorName))
        )
        setLoading(false)
    }, [row.processorName, row.allNodes])

    return <Popover content={<p>Starts the processor.</p>}
                    placement={"bottom"}>
        <Button type="default" loading={loading} onClick={onStartAction} disabled={!row.anyNodeStopped}>
            <PlayCircleOutlined/>
        </Button>
    </Popover>
}
