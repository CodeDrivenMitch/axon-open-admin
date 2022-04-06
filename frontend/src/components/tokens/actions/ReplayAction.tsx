import {DeleteOutlined} from "@ant-design/icons";
import {Button, Popconfirm, Popover} from "antd";
import React, {useCallback, useState} from "react";
import {executeCommands} from "../commands/CommandExecutor";
import {ResetCommand, StartCommand, StopCommand} from "../commands/Commands";
import {TokenOverviewData} from "../TokenOverviewData";


export function ReplayAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onStopAction = useCallback(async () => {
        setLoading(true)
        await executeCommands(
            [
                ...row.allNodes.map(owner => new StopCommand(owner, row.processorName)),
                new ResetCommand(row.owner, row.processorName),
                ...row.allNodes.map(owner => new StartCommand(owner, row.processorName)),
            ]
        )
        setLoading(false)
    }, [row.processorName, row.owner, row.allNodes])

    return <Popover content={<p>Starts a replay of this processor. Will reset the tokens.</p>} placement={"bottom"}>
        <Popconfirm
            title={`Are you sure you want to replay ${row.processorName}?`}
            onConfirm={onStopAction}
            okText="Yes"
            cancelText="No"
        ><Button type="default" loading={loading}>
            <DeleteOutlined/>
        </Button>
        </Popconfirm>
    </Popover>
}
