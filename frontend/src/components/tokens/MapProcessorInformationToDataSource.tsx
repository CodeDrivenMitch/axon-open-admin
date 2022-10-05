import _ from "lodash";
import {DlqOverviewInfo} from "../../redux/dlq/DlqSlice";
import {NodeInformation, TokenInformationSummary} from "../../redux/tokens/models";
import {TokenOverviewData} from "./TokenOverviewData";

export function mapProcessorInformationToDataSource(processorInformation: TokenInformationSummary | null, nodeInformation: NodeInformation[], dlqInformation: { [name: string]: DlqOverviewInfo }): TokenOverviewData[] {

    return processorInformation?.processors?.flatMap(p => {
        return p.segments.map((segment, index, all) => {
            const processorStates = nodeInformation.flatMap(ni => ni.processorStates?.filter(ps => ps.name === p.name)) || []
            return {
                key: p.name + segment.segment,
                rowSpan: index === 0 ? all.length : 0,
                processorName: p.name,
                currentIndex: segment.currentIndex,
                behind: segment.behind,
                segment: segment.segment,
                mergeableSegment: segment.mergeableSegment,
                owner: segment.owner,
                allOwners: _.uniq(p.segments.map(i => i.owner)).filter(i => i != null),
                allNodes: nodeInformation.map(i => i.nodeId).filter(i => i != null),
                tokenType: segment.tokenType,
                replaying: p.segments.filter(s => s.replaying).length > 0,
                processorHasUnclaimed: p.segments.filter(s => !s.owner).length > 0,
                secondsToHead: ((segment.statistics?.seconds300?.minutesToHead ?? 0) * 60)?.toFixed(2),
                positionRate1m: typeof segment.statistics?.seconds60?.positionRate === "number" ? segment.statistics.seconds60.positionRate.toFixed(2) : undefined,
                positionRate5m: typeof segment.statistics?.seconds10?.positionRate === "number" ? segment.statistics.seconds10.positionRate.toFixed(2) : undefined,
                resettable: !!processorStates?.find(ps => ps?.resettable),
                anyNodeRunning: !!processorStates?.find(ps => ps?.running || ps?.error),
                anyNodeStopped: !!processorStates?.find(ps => !ps?.running && !ps?.error),
                batchSize: processorStates && processorStates[0] ? processorStates[0]?.batchSize : 1,
                threadsAvailable: !!processorStates.find(i => (i?.availableProcessorThreads ?? 0) > 0),
                dlqAvailable: !!dlqInformation[p.name],
                dlqSize: dlqInformation[p.name]?.numberOfMessages,
            }
        })
    }) ?? [];
}
