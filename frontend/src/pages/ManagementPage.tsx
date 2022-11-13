import {Card, Space} from "antd";
import _ from "lodash";
import React from "react";
import {useSelector} from "react-redux";
import {mapProcessorInformationToDataSource} from "../components/processors/MapProcessorInformationToDataSource";
import ProcessorTable from "../components/processors/ProcessorTable";
import {nodeInformationSelector} from "../redux/overview/slice";

export function ManagementPage() {
    const nodeInformation = useSelector(nodeInformationSelector)
    const services = _.uniq(nodeInformation.map(r => r.service))
    return <Space direction={"vertical"} size={"large"}>
        {services.map(service => {
            return <Card key={service}
                         title={`Processor status of service ${service}`}>
                <ProcessorTable
                    rows={mapProcessorInformationToDataSource(nodeInformation.filter(ni => ni.service === service))}/>
            </Card>
        })}
    </Space>;
}
