import {QuestionCircleOutlined} from "@ant-design/icons";
import {Card, Popover, Space, Typography} from "antd";
import _ from "lodash";
import React from "react";
import {useSelector} from "react-redux";
import ProcessorTable from "../components/processors/ProcessorTable";
import {nodeInformationSelector} from "../redux/tokens/TokenSlice";

const description = `Here you can find the status of the nodes we have discovered through firing rest calls at your back-ends. Don't worry, they are lightning-fast calls with little performance impact. Each time a node is discovered, or is lost, the table is updated.`

export function ProcessorManagementCard() {
    const nodeInformations = useSelector(nodeInformationSelector)
        .map(r => ({...r, key: r.nodeId}))

    const allProcessors = _.uniq(nodeInformations
        .flatMap((n) => n.processorStates?.map(ps => ps.name) ?? []));
    return <Card title={<div>
        <Popover
            placement={"right"}
            style={{float: 'right'}}
            content={
                <Typography.Text>{description}</Typography.Text>}>
            <QuestionCircleOutlined/></Popover> Processor status
    </div>}>
        <Space direction={"vertical"}>
            <ProcessorTable rows={nodeInformations} processors={allProcessors}/>
        </Space>
    </Card>;
}
