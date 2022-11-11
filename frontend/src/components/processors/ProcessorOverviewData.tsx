export interface ProcessorOverviewData {
    key: string,
    processorName: string,
    numberOfNodes: number,
    numberOfRunningNodes: number,
    claimedPercentage: number,
    behind: number,
    replaying: boolean,
    resettable: boolean,
    threadsAvailable: number,
    threadsActive: number,
    dlqAvailable: boolean,
    dlqSize: number | undefined,
    nodes: NodeDetailData[]
}

export interface NodeDetailData {
    key: string,
    nodeId: string,
    processorName: string,
    processorType: string,
    running: boolean,
    claimedNumber: number,
    claimedPercentage: number,
    threadsAvailable: number | undefined,
    threadsActive: number | undefined,
    batchSize: number,
    behind: number,
    claimed: SegmentDetailData[],
}

export interface SegmentDetailData {
    key: number,
    nodeId: string,
    processorName: string,
    id: number,
    percentage: number,
    behind: number,
    mergeableSegment: number,
    replaying: boolean,
}
