
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
    statistics: Statistics | null
    secondsToHead: number | null
}

export interface Statistics {
    seconds10: StatisticForTime
    seconds60: StatisticForTime
    seconds300: StatisticForTime
}


export interface StatisticForTime {
    seconds: number
    positionRate: number | null,
    minutesToHead: number | null,
}
