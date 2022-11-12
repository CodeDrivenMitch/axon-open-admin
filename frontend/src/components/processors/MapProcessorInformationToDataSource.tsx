import _ from "lodash";
import {NodeInformation} from "../../redux/overview/models";
import {ProcessorOverviewData} from "./ProcessorOverviewData";

export function mapProcessorInformationToDataSource(nodeInformation: NodeInformation[]): ProcessorOverviewData[] {


    const processors = nodeInformation.flatMap(ni => ni.processors?.map(nps => ({
        service: ni.service,
        name: nps.name
    })) || []);
    return _.uniq(processors)
        .map(({service, name}) => {
            const instances = nodeInformation.filter(ni => ni.service === service).flatMap(ni => ni.processors || []).filter(n => n.name === name);
            return {
                key: name,
                processorName: name,
                service: service,
                numberOfNodes: instances.length,
                numberOfRunningNodes: instances.filter(i => i.status.running).length,
                claimedPercentage: _.sum(instances.flatMap(i => i.status.segments.map(s => 1 / s.oneOf))),
                behind: _.sum(instances.flatMap(i => i.status.segments.map(s => s.behind))),
                replaying: instances.filter(i => i.status.segments.filter(s => s.replaying).length > 0).length > 0,
                resettable: instances.filter(i => !i.status.resettable).length === 0,
                threadsAvailable: _.sum(instances.map(i => i.status.availableProcessorThreads)),
                threadsActive: _.sum(instances.map(i => i.status.activeProcessorThreads)),
                dlqAvailable: instances[0].status.dlqConfigured,
                dlqSize: instances[0].dlq?.numberOfMessages,
                nodes: instances.map(i => {
                    return {
                        key: i.status.nodeId,
                        nodeId: i.status.nodeId,
                        processorName: name,
                        running: i.status.running,
                        behind: _.sum(i.status.segments.map(s => s.behind)),
                        batchSize: i.status.batchSize,
                        threadsAvailable: i.status.availableProcessorThreads,
                        threadsActive: i.status.activeProcessorThreads,
                        claimedPercentage: _.sum(i.status.segments.map(s => 1 / s.oneOf)),
                        claimedNumber: i.status.segments.length,
                        processorType: i.status.type,
                        claimed: i.status.segments.map(s => ({
                                key: s.segment,
                                id: s.segment,
                                percentage: (1 / s.oneOf) * 100,
                                behind: s.behind,
                                mergeableSegment: s.mergeableSegment,
                                nodeId: i.status.nodeId,
                                processorName: name,
                                replaying: s.replaying
                            }
                        ))
                    }
                })
            }
        })
}
