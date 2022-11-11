import _ from "lodash";
import {DlqOverviewInfo} from "../../redux/dlq/DlqSlice";
import {NodeInformation} from "../../redux/tokens/models";
import {ProcessorOverviewData} from "./ProcessorOverviewData";

export function mapProcessorInformationToDataSource(nodeInformation: NodeInformation[], dlqInformation: { [name: string]: DlqOverviewInfo }): ProcessorOverviewData[] {


    const processorNames = nodeInformation.flatMap(ni => ni.processorStates?.map(nps => nps.name) || []);
    return _.uniq(processorNames)
        .map(name => {
            const instances = nodeInformation.flatMap(ni => ni.processorStates || []).filter(n => n.name === name);
            return {
                key: name,
                processorName: name,
                numberOfNodes: instances.length,
                numberOfRunningNodes: instances.filter(i => i.running).length,
                claimedPercentage: _.sum(instances.flatMap(i => i.segments.map(s => 1 / s.oneOf))),
                behind: _.sum(instances.flatMap(i => i.segments.map(s => s.behind))),
                replaying: instances.filter(i => i.segments.filter(s => s.replaying).length > 0).length > 0,
                resettable: instances.filter(i => !i.resettable).length === 0,
                threadsAvailable: _.sum(instances.map(i => i.availableProcessorThreads)),
                threadsActive: _.sum(instances.map(i => i.activeProcessorThreads)),
                dlqAvailable: !!dlqInformation[name],
                dlqSize: dlqInformation[name]?.numberOfMessages,
                nodes: instances.map(i => {
                    return {
                        key: i.nodeId,
                        nodeId: i.nodeId,
                        processorName: name,
                        running: i.running,
                        behind: _.sum(i.segments.map(s => s.behind)),
                        batchSize: i.batchSize,
                        threadsAvailable: i.availableProcessorThreads,
                        threadsActive: i.activeProcessorThreads,
                        claimedPercentage: _.sum(i.segments.map(s => 1 / s.oneOf)),
                        claimedNumber: i.segments.length,
                        processorType: i.type,
                        claimed: i.segments.map(s => ({
                                key: s.segment,
                                id: s.segment,
                                percentage: (1 / s.oneOf) * 100,
                                behind: s.behind,
                                mergeableSegment: s.mergeableSegment,
                                nodeId: i.nodeId,
                                processorName: name,
                                replaying: s.replaying
                            }
                        ))
                    }
                })
            }
        })
}
