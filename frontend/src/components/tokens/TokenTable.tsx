import {Space, Table, Tag, Typography} from "antd";
import React from "react";
import {TokenOverviewData} from "./TokenOverviewData";
import {ProcessorActions} from "./actions/ProcesorActions";
import {TimeToHeadTag} from "./TimeToHeadTag";
import {SegmentActions} from "./actions/SegmentActions";

function TokenTable({loading, rows}: { loading: boolean, rows: TokenOverviewData[] }) {
    return (
        <Table loading={loading} dataSource={rows} pagination={{pageSize: 20}} size={"small"}>
            <Table.Column title="Processor" key="processorName"
                          render={row => ({children: <ProcessorTitle row={row}/>, props: {rowSpan: row.rowSpan}})}/>
            <Table.Column title="Actions" key="processorActions" render={row => ({children: <ProcessorActions row={row}/>, props: {rowSpan: row.rowSpan}})}/>
            <Table.Column title="Segment" key="segment" dataIndex="segment"/>
            <Table.Column title="Status" key="status" render={row => <StatusRow row={row}/>}/>
            <Table.Column title={"Behind"} key="behind" dataIndex="behind"/>
            <Table.Column title="Events/m (1m)" key="positionRate1m" dataIndex="positionRate1m"/>
            <Table.Column title="Time to head" key="timeToHead"
                          render={row => <TimeToHeadTag behind={row.behind} secondsToHead={row.secondsToHead} replaying={row.replaying} batchSize={row.batchSize}/>}/>
            <Table.Column title="Actions" key="actions"
                          render={row => <SegmentActions row={row}/>}/>
        </Table>
    );
}

function StatusRow({row}: { row: TokenOverviewData }) {
    return <Space>
        {row?.owner && <Tag color="green">{row.owner}</Tag>}
        {!row?.owner && <Tag color="red">Unclaimed</Tag>}
        {row?.replaying && <Tag color="orange" style={{float: 'right'}}>Replaying</Tag>}
    </Space>
}

function ProcessorTitle({row}: { row: TokenOverviewData }) {
    return <Space>
        <Typography.Title level={5}>{row.processorName}</Typography.Title>
    </Space>
}

export default TokenTable;
