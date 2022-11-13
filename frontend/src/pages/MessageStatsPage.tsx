import {Button, Card, Space, Table} from "antd";
import _ from "lodash";

// @ts-ignore
import plantumlEncoder from 'plantuml-encoder';
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {MessageDefinition, NodeInformation} from "../redux/overview/models";
import {nodeInformationSelector} from "../redux/overview/slice";

interface MessageStatRow {
    handler: UniqueHandler
    nodeId: string,
    success: number,
    failure: number,
    dispatchedMessages: Array<{
        message: MessageDefinition,
        count: number
    }>
}

interface UniqueHandler {
    message: MessageDefinition,
    service?: string,
    signature?: string,
}

export function MessageStatsPage() {
    const nodeInformation = useSelector(nodeInformationSelector)
    const [selectedMessage, setSelectedMessage] = useState(null as UniqueHandler | null)


    const rows = _.orderBy(nodeInformation.flatMap(ni => {
        return ni.insight.handlers.map(h => {
            return {
                handler: {
                    message: h.handler.message,
                    signature: h.handler.signature,
                    service: ni.service
                },
                nodeId: ni.nodeId,
                success: h.stats.successCounter,
                failure: h.stats.failureCounter,
                dispatchedMessages:
                    Object.values(h.stats.publishedMessages).map(pm => {
                        return {
                            message: pm.message,
                            count: pm.count
                        }
                    })
            } as MessageStatRow
        })
    }), value => `${value.handler.message.messageType}_${value.handler.message.payloadType}_${value.handler.service}_${value.nodeId}`)

    return <Space direction={"vertical"} size={"large"}>
        <Card title={"Message statistics"}>
            <Table dataSource={rows} pagination={false} size={"large"}>
                <Table.Column title={"Message Type"} key={"messageType"} render={(row: MessageStatRow) => {
                    return ({
                        children: <span>{row.handler.message.messageType}</span>,
                    });
                }}/>
                <Table.Column title={"Payload"} key={"payload"} render={(row: MessageStatRow) => {
                    return ({
                        children: <Button type={"link"}
                                          onClick={() => setSelectedMessage(row.handler)}>{row.handler.message.payloadType}</Button>,
                    });
                }}/>
                <Table.Column title={"Service"} key={"service"} render={(row: MessageStatRow) => row.handler.service}/>
                <Table.Column title={"Node"} key={"nodeId"} render={(row: MessageStatRow) => row.nodeId}/>
                <Table.Column title={"Signature"} key={"signature"}
                              render={(row: MessageStatRow) => row.handler.signature}/>
                <Table.Column title={"Success"} key={"success"} render={(row: MessageStatRow) => row.success}/>
                <Table.Column title={"Failure"} key={"failure"} render={(row: MessageStatRow) => row.failure}/>
                <Table.Column title={"Dispatches messages"} key={"publishes"}
                              render={(row: MessageStatRow) =>
                                  <Space direction={"vertical"}>{row.dispatchedMessages.map(dm => <span
                                      key={dm.message.payloadType}>{dm.message.payloadType} ({dm.count})</span>)}
                                  </Space>
                              }/>

            </Table>
        </Card>
        <Card title={"Message flow"}>
            {!selectedMessage &&
                <div>Click on one of the messages in the table to show the entire flow for this message throughout all
                    services</div>}
            {selectedMessage && <div>
                <Diagram rows={rows} focusHandler={selectedMessage} nodeInformation={nodeInformation}/>
            </div>}
        </Card>
    </Space>;
}

function Diagram({
                     rows,
                     focusHandler,
                     nodeInformation
                 }: { rows: MessageStatRow[], focusHandler: UniqueHandler, nodeInformation: NodeInformation[] }) {
    const buildIncomingMessages = (currentHandler: UniqueHandler, depth = 0): { handler: UniqueHandler, depth: number }[] => {
        const items = rows
            .filter(r => r.dispatchedMessages.filter(dm => _.isEqual(dm.message, currentHandler.message)).length > 0);
        return [
            {handler: currentHandler, depth: depth},
            ...items.flatMap(r => {
                return buildIncomingMessages(r.handler, depth + 1);
            }),
        ]
    }
    const buildOutgoingMessages = (currentHandler: UniqueHandler, depth = 0): { handler: UniqueHandler, depth: number }[] => {
        const messageStatRows = rows
            .filter(r => _.isEqual(currentHandler, r.handler));
        const items = messageStatRows
            .flatMap(r => r.dispatchedMessages
                .flatMap(dm => {
                    const results = rows.filter(r => _.isEqual(r.handler.message, dm.message))
                        .flatMap(r => ({handler: r.handler, depth: depth}));
                    if (results.length === 0) {
                        return [{handler: {message: dm.message}, depth: depth}]
                    }
                    return results
                }));
        return items.flatMap(i => {
            return [i, ...buildOutgoingMessages(i.handler, depth + 1)]
        })
    }
    const previousItems = buildIncomingMessages(focusHandler).filter((pi: any) => pi.depth > 0)
    const nextItems = buildOutgoingMessages(focusHandler)
    const renderHandler = (handler: UniqueHandler) => `<${handler.service || 'unknown'}>\n${handler.message.payloadType}\n${handler.signature?.split(".")[0] || 'unknown'}`
    const rawPlantUml = createPlantUml(renderHandler, focusHandler, previousItems, nextItems);
    const diagram = plantumlEncoder.encode(rawPlantUml)
    return <div>
        <img alt={"PlantUML diagram"} src={"https://www.plantuml.com/plantuml/png/" + diagram}/>
    </div>
}

const getColor = (messageType: string) => {
    console.log(messageType)
    switch (messageType) {
        case 'EventMessage':
            return 'orange';
        case 'CommandMessage':
            return 'blue';
        case 'QueryMessage':
            return 'green';
        default:
            return 'rose'
    }
}

function createPlantUml(renderHandler: (handler: UniqueHandler) => string, focusHandler: UniqueHandler, previousItems: { handler: UniqueHandler; depth: number }[], nextItems: { handler: UniqueHandler; depth: number }[]) {
    return `
        @startmindmap
        <style>    
        node {
            HorizontalAlignment center
        }
        rootNode {
            LineStyle 8.0;3.0
        }
        mindmapDiagram {
          .green {
            BackgroundColor lightgreen
          }
          .blue {
            BackgroundColor lightblue
          }
          .rose {
            BackgroundColor #FFBBCC
          }
          .orange {
            BackgroundColor orange
          }
        }
        </style>
        *:${renderHandler(focusHandler)}\n;<<${getColor(focusHandler.message.messageType)}>>
        
        left side
        
        ${previousItems.map((pi) => `${_.repeat("*", pi.depth + 1)}:${renderHandler(pi.handler)};<<${getColor(pi.handler.message.messageType)}>>`).join("\n")}
        
        right side
        
        ${nextItems.map((pi) => `${_.repeat("*", pi.depth + 2)}:${renderHandler(pi.handler)};<<${getColor(pi.handler.message.messageType)}>>`).join("\n")}
        
        @endmindmap`;
}
