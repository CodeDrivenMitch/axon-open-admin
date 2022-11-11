import {PlayCircleOutlined} from "@ant-design/icons";
import {Button} from "antd";
import React, {useCallback, useState} from "react";
import {StartActionMessage} from "../../../messages";
import {executeCommands} from "../commands/CommandExecutor";
import {StartCommand} from "../commands/Commands";
import {ProcessorOverviewData} from "../ProcessorOverviewData";

export function StartAction({row}: { row: ProcessorOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStartAction = useCallback(async () => {
        setLoading(true)
        await executeCommands(
            row.nodes.filter(node => !node.running).map(node => new StartCommand(node.nodeId, row.processorName))
        )
        setLoading(false)
    }, [row.processorName, row.nodes])

    return <StartActionMessage>
        <Button type="default" loading={loading} onClick={onStartAction}
                disabled={row.numberOfRunningNodes === row.numberOfNodes}>
            <PlayCircleOutlined/>
        </Button>
    </StartActionMessage>
}
