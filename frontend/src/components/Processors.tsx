import {Space, Table, Tag, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {TimeToHeadTag} from "./TimeToHeadTag";
import {ProcessorInformation} from "../models";
import {ProcessorRowData} from "./ProcessorRowData";
import {ActionBar} from "./actions/ActionBar";
import {contextPath} from "../context";
import {StopAction} from "./actions/StopAction";
import {StartAction} from "./actions/StartAction";

function mapProcessorInformationToDataSource(processorInformation: ProcessorInformation | null): ProcessorRowData[] | undefined {
    return processorInformation?.processors?.flatMap(p => {
        return p.segments.map((segment, index, all) => {
            return {
                key: p.name + segment.segment,
                rowSpan: index === 0 ? all.length : 0,
                processorName: p.name,
                currentIndex: segment.currentIndex,
                behind: segment.behind,
                segment: segment.segment,
                owner: segment.owner,
                tokenType: segment.tokenType,
                replaying: segment.replaying,
                secondsToHead: ((segment.statistics?.seconds60?.minutesToHead ?? 0) * 60).toFixed(2),
                positionRate1m: segment.statistics?.seconds60?.positionRate?.toFixed(2),
                positionRate5m: segment.statistics?.seconds10.positionRate?.toFixed(2),
                status: segment.replaying ? 'Replaying' : (segment.owner ? 'Running' : 'Unclaimed'),
                statusColor: segment.replaying ? 'orange' : (segment.owner ? 'green' : 'red'),
            }
        })
    });
}

function Processors() {
    const [processorInformation, setInfo] = useState(null as ProcessorInformation | null)

    useEffect(() => {
        const interval = setInterval(async () => {
            const result = await fetch(contextPath + "/tokens")
            if (result.ok) {
                setInfo(await result.json())
            } else {
                console.log("Error!") // TODO
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const dataSource = mapProcessorInformationToDataSource(processorInformation);
    console.log(dataSource)
    return (
        <Table loading={!processorInformation} dataSource={dataSource} pagination={{pageSize: 20}} size={"small"}>
            <Table.Column title="Processor" key="processorName" render={row => ({children: <Typography.Title level={5}>{row.processorName}</Typography.Title>, props: {rowSpan: row.rowSpan}})}/>
            <Table.Column title="Actions" key="processorActions" render={row => ({children: <Space><StopAction row={row}/><StartAction row={row}/></Space>, props: {rowSpan: row.rowSpan}})}/>
            <Table.Column title="Segment" key="segment" dataIndex="segment"/>
            <Table.Column title="Status" key="status" render={row => <Tag color={row.statusColor}>{row.owner ?? row.status}</Tag>}/>
            <Table.Column title={"Behind (head " + processorInformation?.headIndex + ")"} key="behind" dataIndex="behind"/>
            <Table.Column title="Events/m (1m)" key="positionRate1m" dataIndex="positionRate1m"/>
            <Table.Column title="Time to head" key="timeToHead"
                          render={row => <TimeToHeadTag behind={row.behind} secondsToHead={row.secondsToHead} replaying={row.replaying}/>}/>
            <Table.Column title="Actions" key="actions"
                          render={row => <ActionBar row={row}/>}/>
        </Table>
    );
}

export default Processors;
