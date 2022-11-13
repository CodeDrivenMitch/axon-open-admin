import {SwapOutlined} from "@ant-design/icons";
import {Button} from "antd";
import React, {useCallback, useState} from "react";
import {ReleaseActionMessage} from "../../../messages";
import {executeCommands} from "../commands/CommandExecutor";
import {ReleaseSegmentCommand} from "../commands/Commands";

export function ReleaseAction({
                                  nodeId, segment, processorName, service
                              }: { nodeId: string, processorName: string, segment: number, service: string }) {
    const [loading, setLoading] = useState(false)

    const onReleaseAction = useCallback(async () => {
        setLoading(true)
        await executeCommands([
                new ReleaseSegmentCommand(service, nodeId, processorName, segment)
            ]
        )
        setLoading(false)
    }, [processorName, segment, nodeId, service])

    return <ReleaseActionMessage>
        <Button type="default" loading={loading}
                onClick={onReleaseAction}>
            <SwapOutlined/>
        </Button>
    </ReleaseActionMessage>
}
