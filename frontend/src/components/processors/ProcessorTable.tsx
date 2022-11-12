import {Popover, Space, Table, Tag, Typography} from "antd";
import _ from "lodash";
import React from "react";
import {Link} from "react-router-dom";
import {
    ColumnTitleAvailableThreads,
    ColumnTitleBatchSize,
    ColumnTitleBehind,
    ColumnTitleClaimedNode,
    ColumnTitleClaimedProcessor,
    ColumnTitleDLQ,
    ColumnTitleMergeableSegment,
    ColumnTitleProcessorType,
    ColumnTitleSegmentsActive
} from "../../messages";
import {ProcessorActions} from "./actions/ProcesorActions";
import {ReleaseAction} from "./actions/ReleaseAction";
import {NodeDetailData, ProcessorOverviewData, SegmentDetailData} from "./ProcessorOverviewData";

function ProcessorTable({rows}: { rows: ProcessorOverviewData[] }) {
    const services = _.uniq(rows.map(r => r.service))
    return (
        <Table dataSource={rows} pagination={false} size={"small"} expandable={{
            expandedRowRender: row => renderProcessorDetail(row),
        }}>
            {services.length > 1 && <Table.Column title="Service" key="service"
                                                  render={row => row.service}/>}
            <Table.Column title="Processor" key="processorName"
                          render={row => <ProcessorTitle row={row}/>}/>
            <Table.Column title="Actions" key="processorActions"
                          render={row => <ProcessorActions row={row}/>}/>
            <Table.Column title={ColumnTitleDLQ} key="dlq"
                          render={row => <ProcessorDlq row={row}/>}/>
            <Table.Column title="Node Status" key="status"
                          render={row => {
                              if (row.numberOfRunningNodes === row.numberOfNodes) {
                                  return <Tag color="green">{row.numberOfRunningNodes} running</Tag>
                              }
                              if (row.numberOfRunningNodes === 0) {
                                  return <Tag color="red">Stopped</Tag>
                              }
                              return <Tag
                                  color="orange">{row.numberOfRunningNodes} running, {row.numberOfNodes - row.numberOfRunningNodes} stopped</Tag>
                          }}/>
            <Table.Column title={ColumnTitleClaimedProcessor} key="segmentsClaimed"
                          render={row => {
                              if (row.claimedPercentage === 1) {
                                  return <Tag color="green">100% claimed</Tag>
                              }
                              return <Tag color="red">{row.claimedPercentage * 100}% claimed</Tag>
                          }}/>
            <Table.Column key="behind"
                          title={ColumnTitleBehind}
                          render={(row) => {
                              const claimed = row.nodes.flatMap((n: any) => n.claimed)
                              if (row.behind > claimed.length * 1000) {
                                  return <Tag color={"red"}>{row.behind}</Tag>
                              }
                              if (row.behind > claimed.length * 50) {
                                  return <Tag color={"orange"}>{row.behind}</Tag>
                              }
                              return <Tag color={"green"}>{row.behind}</Tag>
                          }}/>
            <Table.Column title={ColumnTitleAvailableThreads} key="availableThreads"
                          render={row => {
                              const text = `${row.threadsAvailable} / ${row.threadsActive + row.threadsAvailable}`
                              if (row.threadsAvailable === 0) {
                                  return <Tag color={"orange"}>{text}</Tag>
                              }
                              return <Tag color={"green"}>{text}</Tag>
                          }}/>
        </Table>
    );
}

function renderProcessorDetail(data: ProcessorOverviewData) {
    return <Table dataSource={data.nodes} pagination={false} size={"small"}
                  expandable={{expandedRowRender: row => renderSegmentDetail(row)}}>
        <Table.Column title="Node" key="nodeId"
                      render={row => row.nodeId}/>
        <Table.Column title={ColumnTitleProcessorType} key="processorType"
                      render={row => row.processorType}/>
        <Table.Column title={ColumnTitleBatchSize} key="batchSize"
                      render={row => row.batchSize}/>
        <Table.Column title={ColumnTitleBehind}
                      key="behind"
                      render={(row) => {
                          if (row.behind > row.claimed.length * 1000) {
                              return <Tag color={"red"}>{row.behind}</Tag>
                          }
                          if (row.behind > row.claimed.length * 50) {
                              return <Tag color={"orange"}>{row.behind}</Tag>
                          }
                          return <Tag color={"green"}>{row.behind}</Tag>
                      }}/>
        <Table.Column title={ColumnTitleClaimedNode} key="segments"
                      render={row => `${row.claimedNumber} - ${row.claimedPercentage * 100}%`}/>
        <Table.Column title={ColumnTitleAvailableThreads} key="availableThreads"
                      render={row => `${row.threadsAvailable} / ${row.threadsActive + row.threadsAvailable}`}/>
        <Table.Column title={ColumnTitleSegmentsActive} key="segmentsActive"
                      width={300}
                      render={row => row.claimed.map((c: SegmentDetailData) => `${c.id} (${c.percentage}%)`).join(", ")}/>
    </Table>
}

function renderSegmentDetail(data: NodeDetailData) {
    return <Table dataSource={data.claimed} pagination={false} size={"small"}>
        <Table.Column title="Segment" key="id"
                      render={row => <div>{row.id}
                          {row.replaying &&
                              <Tag style={{marginLeft: 5}} color={"orange"}>Replaying</Tag>}</div>}/>
        <Table.Column title="Percentage" key="percentage"
                      render={row => row.percentage + "%"}/>
        <Table.Column title={ColumnTitleBehind}
                      key="behind"
                      render={row => row.behind}/>
        <Table.Column title={ColumnTitleMergeableSegment} key="mergeable"
                      render={row => row.mergeableSegment === row.id ? '-' : row.mergeableSegment}/>
        <Table.Column title="Actions" key="actions"
                      render={row => <div>
                          <ReleaseAction segment={row.id} processorName={data.processorName} nodeId={data.nodeId}/>
                      </div>}/>
    </Table>
}

function ProcessorTitle({row}: { row: ProcessorOverviewData }) {
    return <Space>
        <Typography.Title level={5}>{row.processorName} {row.replaying &&
            <Tag color={"orange"}>Replaying</Tag>}</Typography.Title>
    </Space>
}

function ProcessorDlq({row}: { row: ProcessorOverviewData }) {
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

export default ProcessorTable;
