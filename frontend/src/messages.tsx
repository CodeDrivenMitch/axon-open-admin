import {QuestionCircleOutlined} from "@ant-design/icons";
import {Popover, Typography} from "antd";
import React from "react";

const messageStyling = {
    width: 300
}

export const MergeActionMessage = ({children}: { children: any }) =>
    <Popover
        title={<Typography.Text strong>Merge action</Typography.Text>}
        content={
            <div style={messageStyling}>
                <Typography.Paragraph>
                    Merges the smallest segment with its closest relative, creating
                    one token out of two. Effectively reduces active event processor threads by one.
                </Typography.Paragraph>
            </div>
        }
        placement={"bottom"}
    >{children}</Popover>

export const ReleaseActionMessage = ({children}: { children: any }) =>
    <Popover
        title={<Typography.Text strong>Release action</Typography.Text>}
        content={
            <div style={messageStyling}>
                <Typography.Paragraph>
                    Releases this segment on the running node so another node can pick it up.
                    If another node does not pick it up in 5 seconds, this node will pick the segment up again if a
                    thread is
                    free.
                </Typography.Paragraph>
            </div>
        }

        placement={"bottom"}
    >{children}</Popover>

export const ReplayActionMessage = ({children}: { children: any }) =>
    <Popover
        title={<Typography.Text strong>Replay action</Typography.Text>}
        content={
            <div style={messageStyling}>
                <Typography.Paragraph>
                    Starts a replay of this processor. Will stop the event processor on all nodes,
                    reset the processor and then start the processor on all nodes.
                </Typography.Paragraph>
            </div>
        }

        placement={"bottom"}
    >{children}</Popover>

export const ReplayActionConfirmation = ({processorName, children}: { processorName: string, children?: any }) =>
    <Popover
        title={<Typography.Text strong>Confirm Replay action</Typography.Text>}
        content={
            <div style={messageStyling}>
                <Typography.Paragraph>
                    Are you sure you want to replay {processorName}?
                    This might delete data and will start the event stream from the beginning.
                </Typography.Paragraph>
            </div>}
        placement={"bottom"}
    >{children}</Popover>

export const SplitActionMessage = ({children}: { children: any }) =>
    <Popover
        title={<Typography.Text strong>Split action</Typography.Text>}
        content={
            <div style={messageStyling}>
                <Typography.Paragraph>
                    Splits the largest segment in two, increasing active threads of
                    the processor by one.
                </Typography.Paragraph>
                <Typography.Paragraph>
                    Both segments will process half the events of the original, based on the sequence
                    identifier.
                </Typography.Paragraph>
                <Typography.Paragraph>
                    This action needs a free processing thread on the same node and is disabled when there are
                    none.
                </Typography.Paragraph>
            </div>
        }
        placement={"bottom"}
    >{children}</Popover>

export const StartActionMessage = ({children}: { children: any }) =>
    <Popover
        title={<Typography.Text strong>Start action</Typography.Text>}
        content={
            <Typography.Paragraph>
                Starts the processor on all nodes where the processor currently
                is paused.
            </Typography.Paragraph>
        }
        placement={"bottom"}
    >{children}</Popover>

export const StopActionMessage = ({children}: { children: any }) =>
    <Popover
        title={<Typography.Text strong>Pause action</Typography.Text>}
        content={
            <div>
                <Typography.Paragraph>
                    Pauses the processor on all nodes where the processor currently
                    is running.
                </Typography.Paragraph>
            </div>
        }
        placement={"bottom"}
    >{children}</Popover>

export const ColumnTitleBehind = <Popover
    title={<Typography.Text strong>Behind Column</Typography.Text>}
    content={
        <div style={messageStyling}>
            <Typography.Paragraph>
                This number represents the amount of events that the processor still needs to
                process to be completely up-to-date. It's normal to lag behind a little.
                A larger amount can indicate a performance issue.
            </Typography.Paragraph>

            <Typography.Paragraph>
                Note that <a
                href={"https://docs.axoniq.io/reference-guide/axon-framework/tuning/event-processing#blacklisting-events"}>Axon
                Server has a blacklist feature</a>, which means it doesn't send events to the processor if
                the processor has no handlers for those event types.
                If so, Axon Server will at least send one event for every 1000.
            </Typography.Paragraph>
        </div>
    } placement={"bottom"}>Behind <QuestionCircleOutlined/></Popover>

export const ColumnTitleClaimedProcessor = <Popover
    title={<Typography.Text strong>Segments Claimed Column</Typography.Text>}
    content={
        <div style={messageStyling}>
            <Typography.Paragraph>
                The percentage displayed in this column indicates how much of the events are actually being handled.
                When it shows lower than 100%, a part of the events are not being processed.
            </Typography.Paragraph>

            <Typography.Paragraph>
                Causes can include a segment that is in error mode and is not processing events.
                It can also indicate that you have more segments than threads available, leaving some unclaimed.
            </Typography.Paragraph>
        </div>
    } placement={"bottom"}>Claimed Segments <QuestionCircleOutlined/></Popover>


export const ColumnTitleClaimedNode = <Popover
    title={<Typography.Text strong>Segments Claimed Column</Typography.Text>}
    content={
        <div style={messageStyling}>
            <Typography.Paragraph>
                Shows the number of segments that have been claimed and what percentage of the event stream
                it processors.
            </Typography.Paragraph>
        </div>
    } placement={"bottom"}>Claimed Segments <QuestionCircleOutlined/></Popover>

export const ColumnTitleAvailableThreads = <Popover
    title={<Typography.Text strong>Available Threads Column</Typography.Text>}
    content={
        <div style={messageStyling}>
            <Typography.Paragraph>
                Shows how many threads are available out of the total configured.
                Only relevant when using the TrackingEventProcessor.
            </Typography.Paragraph>

            <Typography.Paragraph>
                When using the PooledStreamingEventProcessor, will always show as a positive number.
                This type of processor
                is virtually unlimited in the number of segments it can handle.
            </Typography.Paragraph>
        </div>
    } placement={"bottom"}>Available threads <QuestionCircleOutlined/></Popover>


export const ColumnTitleSegmentsActive = <Popover
    title={<Typography.Text strong>Active Segments Column</Typography.Text>}
    content={
        <div style={messageStyling}>
            <Typography.Paragraph>
                Shows all segments that are active and the portion of the event stream they represent.
                For more information expand the row using the plus icon on the left.
            </Typography.Paragraph>
        </div>
    } placement={"bottom"}>Active Segments <QuestionCircleOutlined/></Popover>


export const ColumnTitleBatchSize = <Popover
    title={<Typography.Text strong>Batch Size Column</Typography.Text>}
    content={
        <div style={messageStyling}>
            <Typography.Paragraph>
                Shows the batch size which was configured for this event processor.
                This is the maximum amount of messages the event processor will process in one transaction.
            </Typography.Paragraph>
        </div>
    } placement={"bottom"}>Batch Size <QuestionCircleOutlined/></Popover>

export const ColumnTitleProcessorType = <Popover
    title={<Typography.Text strong>Processor Type Column</Typography.Text>}
    content={
        <div style={messageStyling}>
            <Typography.Paragraph>
                Shows the implementation class of the processor. Currently can contain two values:
                TrackingEventProcessor and PooledStreamingEventProcessor.

            </Typography.Paragraph>

            <Typography.Paragraph>
                The latter was introduced in Axon Framework 4.5 and is more efficient. <a
                href={"https://docs.axoniq.io/reference-guide/axon-framework/events/event-processors/streaming#configuring-a-pooled-streaming-processor"}>Try
                it out!</a>
            </Typography.Paragraph>
        </div>
    } placement={"bottom"}>Processor Type <QuestionCircleOutlined/></Popover>

export const ColumnTitleMergeableSegment = <Popover
    title={<Typography.Text strong>Mergeable Segment Column</Typography.Text>}
    content={
        <div style={messageStyling}>
            <Typography.Paragraph>
                When we execute the merge action, two segments will be merged together. This column
                indicates for each segment which other segment it will be merged with.
            </Typography.Paragraph>

            <Typography.Paragraph>
                Note that they point towards each other!
            </Typography.Paragraph>
        </div>
    } placement={"bottom"}>Mergeable Segment <QuestionCircleOutlined/></Popover>

export const ColumnTitleDLQ = <Popover
    title={<Typography.Text strong>DLQ</Typography.Text>}
    content={
        <div style={messageStyling}>
            <Typography.Paragraph>
                Axon Framework 4.6 introduced the <a
                href={"https://docs.axoniq.io/reference-guide/axon-framework/events/event-processors#dead-letter-queue"}>Dead-Letter
                Queue</a>. This column shows the number
                of dead letters in the queue for this processor when it is configured.
            </Typography.Paragraph>

            <Typography.Paragraph>
                Instead of stalling the event processor <a
                href={"https://docs.axoniq.io/reference-guide/axon-framework/events/event-processors#processing-group-listener-invocation-error-handler"}>when
                the processing group is configured with a propagating error handler</a>,
                it will insert the messages into the DLQ. Any event for the same sequence identifier (aggregate
                identifier by default)
                will be queued as well, guaranteeing that it's handled within that sequence in the intended order.
            </Typography.Paragraph>
            <Typography.Paragraph>
                When there are letters in the queue you will be able to explore them, retry them and/or delete them.
            </Typography.Paragraph>
        </div>
    } placement={"bottom"}>DLQ <QuestionCircleOutlined/></Popover>
