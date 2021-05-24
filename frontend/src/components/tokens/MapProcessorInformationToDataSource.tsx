import {TokenInformationSummary} from "../../redux/tokens/models";
import {TokenOverviewData} from "./TokenOverviewData";

export function mapProcessorInformationToDataSource(processorInformation: TokenInformationSummary | null): TokenOverviewData[] {
    return processorInformation?.processors?.flatMap(p => {
        return p.segments.map((segment, index, all) => {
            return {
                key: p.name + segment.segment,
                rowSpan: index === 0 ? all.length : 0,
                processorName: p.name,
                currentIndex: segment.currentIndex,
                behind: segment.behind,
                segment: segment.segment,
                owner: segment.owner,
                tokenType: segment.tokenType,
                replaying: p.segments.filter(s => s.replaying).length > 0,
                processorHasUnclaimed: p.segments.filter(s => !s.owner).length > 0,
                secondsToHead: ((segment.statistics?.seconds300?.minutesToHead ?? 0) * 60).toFixed(2),
                positionRate1m: segment.statistics?.seconds60?.positionRate?.toFixed(2),
                positionRate5m: segment.statistics?.seconds10.positionRate?.toFixed(2),
            }
        })
    }) ?? [];
}
