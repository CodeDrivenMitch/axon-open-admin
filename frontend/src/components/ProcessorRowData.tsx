export interface ProcessorRowData {
    key: string,
    processorName: string,
    currentIndex: number,
    behind: number,
    segment: number,
    owner: string,
    tokenType: string,
    replaying: boolean,
    positionRate1m: string | undefined,
    positionRate5m: string | undefined,
    status: string,
    statusColor: string,
}
