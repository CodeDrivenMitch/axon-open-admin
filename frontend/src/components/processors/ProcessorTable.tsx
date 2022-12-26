import {Popover, Space, Table, Tag, Typography} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import {
    ColumnTitleAvailableThreads,
    ColumnTitleBatchSize,
    ColumnTitleBehind,
    ColumnTitleCapacity,
    ColumnTitleClaimedNode,
    ColumnTitleClaimedProcessor,
    ColumnTitleDLQ,
    ColumnTitleLatency,
    ColumnTitleMergeableSegment,
    ColumnTitleProcessorType
} from "../../messages";
import {ProcessorActions} from "./actions/ProcesorActions";
import {ReleaseAction} from "./actions/ReleaseAction";
import {NodeDetailData, ProcessorOverviewData} from "./ProcessorOverviewData";
import {contextPath} from "../../context";

function ProcessorTable({rows}: { rows: ProcessorOverviewData[] }) {
    return (
        <Table dataSource={rows} pagination={false} size={"small"} expandable={{
            expandedRowRender: row => renderProcessorDetail(row),
        }}>
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
            <Table.Column title={ColumnTitleCapacity} key="capacity"
                          render={row => row.capacity > 0 ? `${row.capacity}%` : '-'}/>
            <Table.Column title={ColumnTitleLatency} key="latency"
                          render={row => {
                              return latencyToText(row.latency);
                          }}/>
            <Table.Column title="Warnings" key="warnings"
                          render={row => {
                              if (row.warnings.multipleTokenStoreIdentifiers) {
                                  return <Popover
                                      title={<Typography.Text strong>Multiple token stores</Typography.Text>}
                                      content={<p>Multiple token stores were detected for this processor. <br/>
                                          This means multiple applications are running as the same component <br/>
                                          but with a
                                          different database. Events are now processed more than once. <br/>
                                      </p>}>
                                      <Tag color={"red"}>Multiple token stores detected!</Tag>
                                  </Popover>
                              }

                              if (row.warnings.doubleClaimedSegments.length > 0) {
                                  return <Popover title={<Typography.Text strong>Double claims</Typography.Text>}
                                                  content={<p>Some segments of this processor are claimed by multiple
                                                      nodes <br/>This could mean the <a
                                                          href={"https://docs.axoniq.io/reference-guide/axon-framework/events/event-processors/streaming#token-stealing"}>token
                                                          has been stolen because processing took too long</a>. </p>}>
                                      <Tag color={"red"}>Token stealing detected!</Tag>
                                  </Popover>
                              }

                              if (row.warnings.unclaimedSegments && row.numberOfRunningNodes > 0 && row.threadsAvailable === 0) {
                                  return <Popover title={<Typography.Text strong>Unclaimed segments because of a lack of
                                      threads</Typography.Text>}
                                                  content={<p>Some segments of this processor are not claimed by any
                                                      node. <br/>
                                                      This is because you are using a TrackingEventProcessor, but the
                                                      number of segments is higher than the number of available
                                                      threads. <br/>
                                                      Please take a look at the <a
                                                          href={"https://docs.axoniq.io/reference-guide/axon-framework/events/event-processors/streaming#thread-configuration"}>documentation</a> to
                                                      see how to fix this.
                                                  </p>}>
                                      <Tag color={"red"}>Not enough threads!</Tag>
                                  </Popover>
                              }
                              if (row.warnings.unclaimedSegments && row.numberOfRunningNodes > 0) {
                                  return <Popover title={<Typography.Text strong>Unclaimed segments</Typography.Text>}
                                                  content={<p>Some segments of this processor are not claimed by any
                                                      node. <br/>
                                                      There seem to be enough threads available, so one of the segment
                                                      is most likely throwing errors and is in is retry mode. <br/>
                                                      Take a look at your logs for more information.
                                                  </p>}>
                                      <Tag color={"red"}>Unclaimed segments!</Tag>
                                  </Popover>
                              }
                              return <></>
                          }}/>
        </Table>
    );
}

function latencyToText(latency: number) {
    if (latency < 0) {
        return "-"
    }
    if (latency > 1000 * 60 * 60) {
        return (Math.round(latency / 3600000 * 10) / 10) + "hrs"
    }
    if (latency > 1000 * 60) {
        return (Math.round(latency / 60000 * 10) / 10) + "min"
    }
    if (latency > 2000) {
        return Math.round(latency / 1000) + "sec"
    }
    return latency !== -1 ? `${latency}ms` : '-';
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
        <Table.Column title={ColumnTitleCapacity} key="capacity"
                      render={row => row.capacity > 0 ? `${row.capacity}%` : '-'}/>
        <Table.Column title={ColumnTitleLatency} key="latency"
                      render={row => {
                          return latencyToText(row.latency);
                      }}/>
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
                          <ReleaseAction segment={row.id} processorName={data.processorName} nodeId={data.nodeId}
                                         service={data.service}/>
                      </div>}/>
    </Table>
}

function ProcessorTitle({row}: { row: ProcessorOverviewData }) {
    return <Space direction={"horizontal"}>
        <Typography.Title level={5}>{row.processorName}</Typography.Title>
        {row.replaying && <Tag color={"orange"}>Replaying</Tag>}
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
        <Tag color="red"><Link to={`${contextPath}/dlq/${row.service}/${row.processorName}`}>{row.dlqSize}</Link></Tag>
    </Popover>
}

export default ProcessorTable;
