export interface TokenOverviewData {
    key: string,
    processorName: string,
    processorHasUnclaimed: boolean,
    currentIndex: number,
    behind: number,
    segment: number,
    owner: string,
    tokenType: string,
    replaying: boolean,
    positionRate1m: string | undefined,
    positionRate5m: string | undefined,
}
