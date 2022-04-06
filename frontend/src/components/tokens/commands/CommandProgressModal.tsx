import {Modal, Space, Steps, Typography} from "antd";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    closeProgressModal,
    CommandProgress,
    commandsFinished,
    progressItems,
    progressModalOpened
} from "../../../redux/tokens/TokenSlice";
import {cancelCommandExecution} from "./CommandExecutor";


function getStatus(item: CommandProgress) {
    if (item.success) {
        return "finish"
    }
    if (item.loading) {
        return "process"
    }
    if (item.error) {
        return "error"
    }
    return "wait"
}

export function CommandProgressModal() {
    const dispatch = useDispatch()
    const isOpened = useSelector(progressModalOpened)
    const items = useSelector(progressItems) || []
    const finished = useSelector(commandsFinished)
    const error = items.find(i => i.error)

    return <Modal visible={isOpened} title={"Execution progress"}
                  onOk={() => dispatch(closeProgressModal())}
                  okButtonProps={{disabled: !finished}}
                  cancelButtonProps={{disabled: finished}}
                  cancelText={"Stop command execution"}
                  onCancel={cancelCommandExecution}
                  closable={false}>
        <Space direction={"vertical"}>
            <Typography.Paragraph>Executing {items?.length} commands to Axon framework:</Typography.Paragraph>
            <Steps direction="vertical">
                {items?.map((item, index) => <Steps.Step key={index} title={item.description} status={getStatus(item)}
                                                         description={item.loading || item.error ? `Attempt: ${item.attempt}/10` : ""}/>)}
            </Steps>

            {finished && !error && <Typography.Paragraph strong type={"success"}>
                Commands executed successfully
            </Typography.Paragraph>}
            {finished && !!error && <Typography.Paragraph type={"danger"}>
                Commands execution failed. Error: {error.error}. <br/>
                This might be due to your load balancer. If you have sticky sessions enabled or if you have a node running that is not reachable using the same url as this page, the commands might fail.
            </Typography.Paragraph>}
        </Space>
    </Modal>
}
