import {SplitCellsOutlined} from "@ant-design/icons";
import {Button, Popover} from "antd";
import React, {useCallback, useState} from "react";
import {executeCommands} from "../commands/CommandExecutor";
import {SplitSegmentCommand, StartCommand, StopCommand} from "../commands/Commands";
import {TokenOverviewData} from "../TokenOverviewData";

export function SplitAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onSplitAction = useCallback(async () => {
        setLoading(true)
        const chosenNode = row.allNodes[0];
        const nodesToStop = row.allNodes.filter(node => node !== chosenNode);
        await executeCommands([
                ...nodesToStop.map(node => new StopCommand(node, row.processorName)),
                new SplitSegmentCommand(chosenNode, row.processorName, row.segment),
                ...nodesToStop.map(node => new StartCommand(node, row.processorName)),
            ]
        )
        setLoading(false)
    }, [row.processorName, row.segment, row.allNodes])

    return <Popover
        content={<p>Splits the token of this segment in two, increasing active threads of the processor by one. <br/>This
            action needs a free processing thread on the same node and is disabled when there are none.</p>}
        placement={"bottom"}>
        <Button type="default" loading={loading} onClick={onSplitAction}
                disabled={row.owner == null || !row.threadsAvailable}>
            <SplitCellsOutlined/>
        </Button>
    </Popover>
}
