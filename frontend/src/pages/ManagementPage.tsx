import {QuestionCircleOutlined} from "@ant-design/icons";
import {Alert, Card, Popover, Space, Typography} from "antd";
import React from "react";
import {useSelector} from "react-redux";
import {mapProcessorInformationToDataSource} from "../components/processors/MapProcessorInformationToDataSource";
import ProcessorTable from "../components/processors/ProcessorTable";
import {nodeInformationSelector, offlineBackendsSelector} from "../redux/overview/slice";

export function ManagementPage() {
    const nodeInformation = useSelector(nodeInformationSelector)
    const offlineBackends = useSelector(offlineBackendsSelector)
    return <Space direction={"vertical"} size={"large"}>
        {offlineBackends.length > 0 && <Alert message="Offline backend servers" type="warning" showIcon
                                              description={`The following servers are unavailable: ${offlineBackends.join(", ")}. The data might be incomplete`}></Alert>}
        <Card title={<div>
            <Popover
                placement={"right"}
                style={{float: 'right'}}
                content={<Typography.Text>Here you can find the status of the segments of each token. You can find a
                    description of each possible action by hovering over it. Good luck!</Typography.Text>}>
                <QuestionCircleOutlined/></Popover> Event Processor Status
        </div>}>
            <ProcessorTable rows={mapProcessorInformationToDataSource(nodeInformation)}/>
        </Card>
    </Space>;
}
