import {DeleteOutlined} from "@ant-design/icons";
import {Button, Popconfirm} from "antd";
import React, {useCallback, useState} from "react";
import {ReplayActionConfirmation, ReplayActionMessage} from "../../../messages";
import {executeCommands} from "../commands/CommandExecutor";
import {ResetCommand, StartCommand, StopCommand} from "../commands/Commands";
import {ProcessorOverviewData} from "../ProcessorOverviewData";


export function ReplayAction({row}: { row: ProcessorOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStopAction = useCallback(async () => {
        setLoading(true)
        await executeCommands(
            [
                ...row.nodes.filter(node => node.running).map(node => new StopCommand(node.nodeId, row.processorName)),
                new ResetCommand(row.nodes[0].nodeId, row.processorName),
                ...row.nodes.map(node => new StartCommand(node.nodeId, row.processorName)),
            ]
        )
        setLoading(false)
    }, [row.processorName, row.nodes])

    return <ReplayActionMessage>
        <Popconfirm
            title={<ReplayActionConfirmation processorName={row.processorName}/>}
            onConfirm={onStopAction}
            okText="Yes"
            cancelText="No"
        ><Button type="default" loading={loading}>
            <DeleteOutlined/>
        </Button>
        </Popconfirm>
    </ReplayActionMessage>
}
