import {Card, Space, Table, Tag, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {TimeToHeadTag} from "./TimeToHeadTag";
import {ProcessorInformation} from "../models";
import {TokenOverviewData} from "./TokenOverviewData";
import {SegmentActions} from "./actions/SegmentActions";
import {contextPath} from "../context";
import {ProcessorActions} from "./actions/ProcesorActions";

function mapProcessorInformationToDataSource(processorInformation: ProcessorInformation | null): TokenOverviewData[] | undefined {
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
                replaying: p.segments.filter(s => s.replaying).length > 0,
                processorHasUnclaimed: p.segments.filter(s => !s.owner).length > 0,
                secondsToHead: ((segment.statistics?.seconds300?.minutesToHead ?? 0) * 60).toFixed(2),
                positionRate1m: segment.statistics?.seconds60?.positionRate?.toFixed(2),
                positionRate5m: segment.statistics?.seconds10.positionRate?.toFixed(2),
            }
        })
    });
}

function TokenOverview() {
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
        <Card title={"Token Status"}>
            <Table loading={!processorInformation} dataSource={dataSource} pagination={{pageSize: 20}} size={"small"}>
                <Table.Column title="Processor" key="processorName"
                              render={row => ({children: <ProcessorTitle row={row}/>, props: {rowSpan: row.rowSpan}})}/>
                <Table.Column title="Actions" key="processorActions" render={row => ({children: <ProcessorActions row={row}/>, props: {rowSpan: row.rowSpan}})}/>
                <Table.Column title="Segment" key="segment" dataIndex="segment"/>
                <Table.Column title="Status" key="status" render={row => <StatusRow row={row}/>}/>
                <Table.Column title={"Behind (head " + processorInformation?.headIndex + ")"} key="behind" dataIndex="behind"/>
                <Table.Column title="Events/m (1m)" key="positionRate1m" dataIndex="positionRate1m"/>
                <Table.Column title="Time to head" key="timeToHead"
                              render={row => <TimeToHeadTag behind={row.behind} secondsToHead={row.secondsToHead} replaying={row.replaying}/>}/>
                <Table.Column title="Actions" key="actions"
                              render={row => <SegmentActions row={row}/>}/>
            </Table>
        </Card>
    );
}

function StatusRow({row}: {row: TokenOverviewData}) {
    return <Space>
        {row?.owner && <Tag color="green">{row.owner}</Tag>}
        {!row?.owner && <Tag color="red">Unclaimed</Tag>}
        {row?.replaying && <Tag color="orange" style={{float: 'right'}}>Replaying</Tag>}
    </Space>
}

function ProcessorTitle({row} : {row: TokenOverviewData}) {
    return <Space>
        <Typography.Title level={5}>{row.processorName}</Typography.Title>
    </Space>
}

export default TokenOverview;
