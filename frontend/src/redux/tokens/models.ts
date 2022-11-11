
export interface NodeInformation {
    nodeId: string
    lastSeen: number
    processorStates?: NodeProcessorState[]
}

export interface NodeProcessorState {
    nodeId: string,
    name: string,
    running: boolean,
    error: boolean,
    resettable: boolean,
    activeProcessorThreads?: number
    availableProcessorThreads?: number
    batchSize: number,
    type: string,
    segments: ProcessorSegmentToken[]
}

export interface ProcessorSegmentToken {
    segment: number
    tokenType: string
    owner: string
    oneOf: number,
    currentIndex: number
    replaying: boolean
    behind: number
    mergeableSegment: number,
}
