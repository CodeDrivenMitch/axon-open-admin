import {QuestionCircleOutlined} from "@ant-design/icons";
import {Card, Popover, Typography} from "antd";
import React from "react";
import {useSelector} from "react-redux";
import {mapProcessorInformationToDataSource} from "../components/tokens/MapProcessorInformationToDataSource";
import TokenTable from "../components/tokens/TokenTable";
import {nodeInformationSelector, processorInformationSelector} from "../redux/tokens/TokenSlice";

const description = `Here you can find the status of the segments of each token. You can find a description of each possible action by hovering over it. Good luck!`

export function TokenManagementCard() {
    const processorInformation = useSelector(processorInformationSelector)
    const nodeInformation = useSelector(nodeInformationSelector)
    return <Card title={<div>
        <Popover
            placement={"right"}
            style={{float: 'right'}}
            content={<Typography.Text>{description}</Typography.Text>}>
            <QuestionCircleOutlined/></Popover> Token status
    </div>}>
        <TokenTable loading={!processorInformation} rows={mapProcessorInformationToDataSource(processorInformation, nodeInformation)}/>
    </Card>;
}
