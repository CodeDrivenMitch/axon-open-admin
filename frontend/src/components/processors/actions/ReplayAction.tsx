import {DeleteOutlined} from "@ant-design/icons";
import {Button, Modal, Popconfirm} from "antd";
import React, {useCallback, useState} from "react";
import {ReplayActionConfirmation, ReplayActionMessage} from "../../../messages";
import {executeCommands} from "../commands/CommandExecutor";
import {ClearDlqCommand, ResetCommand, StartCommand, StopCommand, TokenCommand} from "../commands/Commands";
import {ProcessorOverviewData} from "../ProcessorOverviewData";


export function ReplayAction({row}: { row: ProcessorOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStopAction = useCallback(async () => {
        setLoading(true)
        const {confirm} = Modal;
        async function execute(withDlqReset: boolean) {
            executeCommands(
                [
                    ...row.nodes.filter(node => node.running).map(node => new StopCommand(row.service, node.nodeId, row.processorName)),
                    withDlqReset ? new ClearDlqCommand(row.service, row.nodes[0].nodeId, row.processorName) : null,
                    new ResetCommand(row.service, row.nodes[0].nodeId, row.processorName),
                    ...row.nodes.map(node => new StartCommand(row.service, node.nodeId, row.processorName)),
                ].filter(c => !!c) as TokenCommand[]
            )
        }

        if (row.dlqAvailable && row.dlqSize && row.dlqSize) {
            confirm({
                title: "DLQ items detected",
                content: "Do you want to clear the DLQ while resetting the event processor?",
                onOk: () => execute(true),
                onCancel: () => execute(false)
            })
        } else {
            await execute(false)
        }
        setLoading(false)
    }, [row.processorName, row.nodes, row.dlqSize, row.dlqAvailable, row.service])

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
