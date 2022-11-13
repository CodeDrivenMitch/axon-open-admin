import _ from "lodash";
import {NodeInformation, NodeProcessorState} from "../../redux/overview/models";
import {ProcessorOverviewData} from "./ProcessorOverviewData";

export function mapProcessorInformationToDataSource(nodeInformation: NodeInformation[]): ProcessorOverviewData[] {


    const processors = nodeInformation.flatMap(ni => ni.processors?.map(nps => ({
        service: ni.service,
        name: nps.name
    })) || []);
    return _.uniqBy(processors, pi => `${pi.service}_${pi.name}`)
        .map(({service, name}) => {
            const instances = nodeInformation.filter(ni => ni.service === service)
                .flatMap(ni => {
                    return {
                        nodeId: ni.nodeId,
                        processor: (ni.processors || []).filter(n => n.name === name)[0]
                    }
                });
            const instanceProcessors = instances.map(i => i.processor)
            return {
                key: name,
                processorName: name,
                service: service,
                numberOfNodes: instances.length,
                numberOfRunningNodes: instanceProcessors.filter(i => i.status.running).length,
                claimedPercentage: _.sum(instanceProcessors.flatMap(i => i.status.segments.map(s => 1 / s.oneOf))),
                behind: _.sum(instanceProcessors.flatMap(i => i.status.segments.map(s => s.behind))),
                replaying: instanceProcessors.filter(i => i.status.segments.filter(s => s.replaying).length > 0).length > 0,
                resettable: instanceProcessors.filter(i => !i.status.resettable).length === 0,
                threadsAvailable: _.sum(instanceProcessors.filter(i => i.status.running).map(i => i.status.availableProcessorThreads)),
                threadsActive: _.sum(instanceProcessors.filter(i => i.status.running).map(i => i.status.activeProcessorThreads)),
                dlqAvailable: instanceProcessors[0].status.dlqConfigured,
                dlqSize: instanceProcessors[0].dlq?.numberOfMessages,
                warnings: {
                    multipleTokenStoreIdentifiers: _.uniq(instanceProcessors.map(i => i.status.tokenStoreIdentifier)).length > 1,
                    doubleClaimedSegments: getDoubleClaimedSegments(instanceProcessors),
                    unclaimedSegments: _.sum(instanceProcessors.flatMap(i => i.status.segments.map(s => 1 / s.oneOf))) < 1
                },
                nodes: instances.map(i => {
                    const status = i.processor.status;
                    return {
                        key: i.nodeId,
                        nodeId: i.nodeId,
                        processorName: name,
                        service: service,
                        running: status.running,
                        behind: _.sum(status.segments.map(s => s.behind)),
                        batchSize: status.batchSize,
                        threadsAvailable: status.availableProcessorThreads,
                        threadsActive: status.activeProcessorThreads,
                        claimedPercentage: _.sum(status.segments.map(s => 1 / s.oneOf)),
                        claimedNumber: status.segments.length,
                        processorType: status.type,
                        claimed: status.segments.map(s => ({
                                key: s.segment,
                                id: s.segment,
                                percentage: (1 / s.oneOf) * 100,
                                behind: s.behind,
                                mergeableSegment: s.mergeableSegment,
                                nodeId: status.nodeId,
                                processorName: name,
                                replaying: s.replaying
                            }
                        ))
                    }
                })
            }
        })
}


function getDoubleClaimedSegments(states: NodeProcessorState[]): string[] {
    const claimedCounts = states.flatMap(p => p.status.segments).reduce((previousValue: any, currentValue) => {
        if (!previousValue[currentValue.segment]) {
            return {...previousValue, [currentValue.segment]: 1}
        }
        return {...previousValue, [currentValue.segment]: previousValue[currentValue.segment] + 1}
    }, {});
    return Object.keys(claimedCounts).filter(key => claimedCounts[key] > 1)
}
