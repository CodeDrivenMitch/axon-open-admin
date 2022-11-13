import {PauseOutlined} from "@ant-design/icons";
import {Button} from "antd";
import React, {useCallback, useState} from "react";
import {StopActionMessage} from "../../../messages";
import {executeCommands} from "../commands/CommandExecutor";
import {StopCommand} from "../commands/Commands";
import {ProcessorOverviewData} from "../ProcessorOverviewData";


export function StopAction({row}: { row: ProcessorOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStopAction = useCallback(async () => {
        setLoading(true)
        await executeCommands(
            row.nodes.filter(node => node.running).map(node => new StopCommand(row.service, node.nodeId, row.processorName))
        )
        setLoading(false)
    }, [row.processorName, row.nodes, row.service])

    return <StopActionMessage>
        <Button type="default" loading={loading} onClick={onStopAction} disabled={row.numberOfRunningNodes === 0}>
            <PauseOutlined/>
        </Button>
    </StopActionMessage>
}
