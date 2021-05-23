import {Table, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {TimeToHeadTag} from "./TimeToHeadTag";
import {ProcessorInformation} from "../models";
import {ProcessorRowData} from "./ProcessorRowData";
import {ActionBar} from "./actions/ActionBar";
import {contextPath} from "../context";

function mapProcessorInformationToDataSource(processorInformation: ProcessorInformation | null): ProcessorRowData[] | undefined {
    return processorInformation?.processors?.flatMap(p => {
        return p.segments.map(segment => {
            return {
                key: p.name + segment.segment,
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
    return (
            <Table loading={!processorInformation} dataSource={dataSource} pagination={{pageSize: 20}}>
                <Table.Column title="Processor" key="processorName" dataIndex="processorName"/>
                <Table.Column title="Segment" key="segment" dataIndex="segment"/>
                <Table.Column title="Status" key="status" render={row => <Tag color={row.statusColor}>{row.status}</Tag>}/>
                <Table.Column title="Owner" key="owner" dataIndex="owner"/>
                <Table.Column title="Type" key="tokenType" dataIndex="tokenType"/>
                <Table.Column title="Current index" key="currentIndex" dataIndex="currentIndex"/>
                <Table.Column title="Behind" key="behind" dataIndex="behind"/>
                <Table.Column title="Events/m (1m)" key="positionRate1m" dataIndex="positionRate1m"/>
                <Table.Column title="Events/m (5m)" key="positionRate5m" dataIndex="positionRate5m"/>
                <Table.Column title="Time to head" key="timeToHead"
                              render={row => <TimeToHeadTag behind={row.behind} secondsToHead={row.secondsToHead} replaying={row.replaying}/>}/>
                <Table.Column title="Actions" key="actions"
                              render={row => <ActionBar row={row}/> }/>
            </Table>
    );
}

export default Processors;
