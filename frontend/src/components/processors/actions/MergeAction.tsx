import {MergeCellsOutlined} from "@ant-design/icons";
import {Button} from "antd";
import React, {useCallback, useState} from "react";
import {MergeActionMessage} from "../../../messages";
import {executeCommands} from "../commands/CommandExecutor";
import {MergeSegmentCommand} from "../commands/Commands";
import {ProcessorOverviewData, SegmentDetailData} from "../ProcessorOverviewData";

export function MergeAction({row}: { row: ProcessorOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onSplitAction = useCallback(async () => {
        setLoading(true)
        const chosenSegment = row.nodes.flatMap(n => n.claimed).reduce((previousValue: SegmentDetailData | null, currentValue: SegmentDetailData) => {
            if (previousValue == null) {
                return currentValue;
            }
            if (currentValue.percentage < previousValue.percentage) {
                return currentValue
            }
            return previousValue
        }, null);
        await executeCommands([
                new MergeSegmentCommand(chosenSegment?.nodeId!!, row.processorName, chosenSegment!!.id),
            ]
        )
        setLoading(false)
    }, [row])

    return <MergeActionMessage>
        <Button type="default" loading={loading} onClick={onSplitAction}
                disabled={row.nodes.flatMap(s => s.claimed).length === 1 || row.nodes.filter(n => n.claimedPercentage > 0).length === 0}>
            <MergeCellsOutlined/>
        </Button>
    </MergeActionMessage>
}
