
export interface ProcessorInformation {
    nodeId: string
    headIndex: number
    processors: Processor[]
}

export interface Processor {
    name: string
    currentIndex: number
    replaying: boolean
    segments: Segment[]
}

export interface Segment {
    segment: number
    tokenType: string
    owner: string
    currentIndex: number
    replaying: boolean
    behind: number
    statistics: Statistics
    secondsToHead: number | null
}

export interface Statistics {
    positionRate1m: number | null,
    positionRate5m: number | null,
}
