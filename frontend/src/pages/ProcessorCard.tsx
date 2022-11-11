import {QuestionCircleOutlined} from "@ant-design/icons";
import {Card, Popover, Typography} from "antd";
import React from "react";
import {useSelector} from "react-redux";
import {mapProcessorInformationToDataSource} from "../components/processors/MapProcessorInformationToDataSource";
import ProcessorTable from "../components/processors/ProcessorTable";
import {dlqCountSelector} from "../redux/dlq/DlqSlice";
import {nodeInformationSelector} from "../redux/tokens/TokenSlice";

const description = `Here you can find the status of the segments of each token. You can find a description of each possible action by hovering over it. Good luck!`

export function ProcessorCard() {
    const nodeInformation = useSelector(nodeInformationSelector)
    const dlqInformation = useSelector(dlqCountSelector)
    return <Card title={<div>
        <Popover
            placement={"right"}
            style={{float: 'right'}}
            content={<Typography.Text>{description}</Typography.Text>}>
            <QuestionCircleOutlined/></Popover> Event Processor Status
    </div>}>
        <ProcessorTable rows={mapProcessorInformationToDataSource(nodeInformation, dlqInformation)}/>
    </Card>;
}
