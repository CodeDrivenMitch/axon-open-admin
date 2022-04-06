import {SwapOutlined} from "@ant-design/icons";
import {Button, Popover} from "antd";
import React, {useCallback, useState} from "react";
import {executeCommands} from "../commands/CommandExecutor";
import {ReleaseSegmentCommand} from "../commands/Commands";
import {TokenOverviewData} from "../TokenOverviewData";

export function ReleaseAction({row}: { row: TokenOverviewData }) {
    const [loading, setLoading] = useState(false)

    const onReleaseAction = useCallback(async () => {
        setLoading(true)
        await executeCommands([
                new ReleaseSegmentCommand(row.owner, row.processorName, row.segment)
            ]
        )
        setLoading(false)
    }, [row.processorName, row.segment, row.owner])

    return <Popover content="Releases this segment on the running node so another node can pick it up"
                    placement={"bottom"}>
        <Button type="default" loading={loading}
                onClick={onReleaseAction}
                disabled={row.owner == null}>
            <SwapOutlined/>
        </Button>
    </Popover>
}
