import {Popover, Space, Table, Tag, Typography} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import {ProcessorActions} from "./actions/ProcesorActions";
import {SegmentActions} from "./actions/SegmentActions";
import {TimeToHeadTag} from "./TimeToHeadTag";
import {TokenOverviewData} from "./TokenOverviewData";

function TokenTable({loading, rows}: { loading: boolean, rows: TokenOverviewData[] }) {
    return (
        <Table loading={loading} dataSource={rows} pagination={false} size={"small"}>
            <Table.Column title="Processor" key="processorName"
                          render={row => ({children: <ProcessorTitle row={row}/>, props: {rowSpan: row.rowSpan}})}/>
            <Table.Column title="DLQ" key="dlq"
                          render={row => ({children: <ProcessorDlq row={row}/>, props: {rowSpan: row.rowSpan}})}/>
            <Table.Column title="Actions" key="processorActions"
                          render={row => ({children: <ProcessorActions row={row}/>, props: {rowSpan: row.rowSpan}})}/>
            <Table.Column title="Segment" key="segment" render={row => row.mergeableSegment !== row.segment ?
                <Popover
                    content={"Can be merged with segment " + row.mergeableSegment}>{row.segment}</Popover> : row.segment}/>
            <Table.Column title="Status" key="status" render={row => <StatusRow row={row}/>}/>
            <Table.Column title={"Behind"} key="behind" dataIndex="behind"/>
            <Table.Column title="Events/m (1m)" key="positionRate1m" dataIndex="positionRate1m"/>
            <Table.Column title="Time to head" key="timeToHead"
                          render={row => <TimeToHeadTag behind={row.behind} secondsToHead={row.secondsToHead}
                                                        replaying={row.replaying} batchSize={row.batchSize}/>}/>
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

function ProcessorDlq({row}: { row: TokenOverviewData }) {
    if (!row.dlqAvailable) {
        return <Popover
            content={<p>There is currently no DLQ configured for this processor. Check the AxonIQ documentation for more
                information.</p>}
            placement={"bottom"}>-</Popover>
    }
    if (row.dlqSize === 0) {
        return <Popover
            content={<p>This processor has a DLQ configured, which is currently empty.</p>}
            placement={"bottom"}>
            <Tag color="green">0</Tag>
        </Popover>
    }
    return <Popover
        content={<p>This processor has a DLQ configured, which currently holds items. Click to show them.</p>}
        placement={"bottom"}>
        <Tag color="red"><Link to={"dlq/" + row.processorName}>{row.dlqSize}</Link></Tag>
    </Popover>
}

export default TokenTable;
