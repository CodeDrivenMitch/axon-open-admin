import {MergeCellsOutlined} from "@ant-design/icons";
import {Button, Popover} from "antd";
import React, {useCallback, useState} from "react";
import {executeCommands} from "../commands/CommandExecutor";
import {MergeSegmentCommand, StartCommand, StopCommand} from "../commands/Commands";
import {TokenOverviewData} from "../TokenOverviewData";

export function MergeAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onSplitAction = useCallback(async () => {
        setLoading(true)
        const chosenNode = row.allNodes[0];
        const nodesToStop = row.allNodes.filter(node => node != chosenNode);
        await executeCommands([
                ...nodesToStop.map(node => new StopCommand(node, row.processorName)),
                new MergeSegmentCommand(chosenNode, row.processorName, row.segment),
                ...nodesToStop.map(node => new StartCommand(node, row.processorName)),
            ]
        )
        setLoading(false)
    }, [row.processorName, row.segment, row.owner, row.allNodes])

    return <Popover
        content={<p>Merges the segment with its closest relative (segment {row.mergeableSegment}), creating one token
            out of two. <br/>Effectively reduces active event processor threads by one.</p>}
        placement={"bottom"}>
        <Button type="default" loading={loading} onClick={onSplitAction}
                disabled={row.owner == null || row.mergeableSegment === row.segment}>
            <MergeCellsOutlined/>
        </Button>
    </Popover>
}
