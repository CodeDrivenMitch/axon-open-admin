export interface ProcessorOverviewData {
    key: string,
    service: string,
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
    capacity: number | undefined,
    latency: number | undefined,
    nodes: NodeDetailData[],
    warnings: {
        multipleTokenStoreIdentifiers: boolean,
        doubleClaimedSegments: string[],
        unclaimedSegments: boolean
    }
}

export interface NodeDetailData {
    key: string,
    nodeId: string,
    service: string,
    processorName: string,
    processorType: string,
    running: boolean,
    claimedNumber: number,
    claimedPercentage: number,
    threadsAvailable: number | undefined,
    threadsActive: number | undefined,
    batchSize: number,
    behind: number,
    capacity: number | undefined,
    latency: number | undefined,
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
