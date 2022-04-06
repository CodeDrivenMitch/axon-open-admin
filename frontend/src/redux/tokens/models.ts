
export interface NodeInformation {
    nodeId: string
    lastSeen: number
    processorStates?: NodeProcessorState[]
}

export interface NodeProcessorState {
    name: string,
    running: boolean,
    error: boolean,
    resettable: boolean,
    activeProcessorThreads?: number
    availableProcessorThreads?: number
    batchSize: number,
    type: string,
}


export interface TokenInformationSummary {
    nodeId: string
    headIndex: number
    processors: ProcessorToken[]
}

export interface ProcessorToken {
    name: string
    currentIndex: number
    replaying: boolean
    segments: ProcessorSegmentToken[]
}

export interface ProcessorSegmentToken {
    segment: number
    tokenType: string
    owner: string
    currentIndex: number
    replaying: boolean
    behind: number
    statistics: TokenStatistics | null
    secondsToHead: number | null,
    mergeableSegment: number,
}

export interface TokenStatistics {
    seconds10: TokenStatisticForTime
    seconds60: TokenStatisticForTime
    seconds300: TokenStatisticForTime
}


export interface TokenStatisticForTime {
    seconds: number
    positionRate: number | null,
    minutesToHead: number | null,
}
