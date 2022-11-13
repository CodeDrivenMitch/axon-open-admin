export interface NodeInformation {
    nodeId: string
    service: string
    processors: NodeProcessorState[]
    insight: InsightInfo
}

export interface MessageDefinition {
    messageType: string,
    payloadType: string
}

export interface InsightInfo {
    handlers: InsightHandlerInfo[]
    originMessages: InsightOriginMessageStats[]
}

export interface InsightHandlerInfo {
    handler: InsightHandler
    stats: InsightHandlerStats
}

export interface InsightHandlerStats {
    failureCounter: number,
    successCounter: number,
    publishedMessages: { [key: string]: { count: number, message: MessageDefinition } }
}

export interface InsightHandler {
    containingClass: string,
    message: MessageDefinition,
    signature: string
}

export interface InsightOriginMessageStats {
    message: MessageDefinition
    count: number
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
    dlq?: DlqOverviewInfo,
    metrics?: EventProcessorMetrics,
}

export interface EventProcessorMetrics {
    capacity?: number | undefined,
    latency?: number | undefined,
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
