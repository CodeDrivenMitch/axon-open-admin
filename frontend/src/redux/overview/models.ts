export interface NodeInformation {
    nodeId: string
    service: string
    processors: NodeProcessorState[]
}

export interface BackendInformation {
    backendName: string,
    online: boolean,
    nodes: { [nodeId: string]: BackendNodeInformation }
}

export interface BackendNodeInformation {
    nodeId: string
    lastSeen: number
    service: string
}

export interface NodeProcessorState {
    name: string
    status: ProcessorStatus
    dlq?: DlqOverviewInfo
}

export interface DlqOverviewInfo {
    numberOfSequences: number,
    numberOfMessages: number,
}

export interface ProcessorStatus {
    nodeId: string,
    name: string,
    tokenStoreIdentifier: string,
    running: boolean,
    error: boolean,
    resettable: boolean,
    activeProcessorThreads?: number
    availableProcessorThreads?: number
    dlqConfigured: boolean
    batchSize: number,
    type: string,
    segments: SegmentStatus[]
}

export interface SegmentStatus {
    segment: number
    tokenType: string
    owner: string
    oneOf: number,
    currentIndex: number
    replaying: boolean
    behind: number
    mergeableSegment: number,
}
