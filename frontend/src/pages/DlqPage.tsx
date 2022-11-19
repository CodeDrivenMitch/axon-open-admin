import {ArrowLeftOutlined, DeleteOutlined, FastForwardOutlined, RedoOutlined} from "@ant-design/icons";
import {Button, Card, message, Popconfirm, Popover, Space, Table} from "antd";
import ButtonGroup from "antd/es/button/button-group";
import moment from "moment";
import React, {useCallback, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {callService} from "../context";

interface DlqItem {
    sequence: string;
    amount: number;
    payload: any;
    causeType: string,
    causeMessage: string
}

export function DlqPage() {
    const history = useHistory();
    const {service, name} = useParams() as { service: string, name: string };
    const [sequences, setSequences] = useState(null as DlqItem[] | null)
    const [error, setError] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [lstUpdated, setLastUpdated] = useState(null as Date | null)

    const fetchPage = useCallback(async (setLoading: boolean = true) => {
        if (setLoading) {
            setFetching(true);
        }
        try {
            const response = await callService(service, async (serviceUrl) => {
                return await fetch(`${serviceUrl}/dlq/items/${name}`, {method: 'GET'})
            })
            setSequences(await response.json());
            setLastUpdated(new Date());
        } catch (e) {
            setSequences([]);
            setError(true);
            setLastUpdated(null);
        }

        setFetching(false)
    }, [setFetching, name, service])

    useEffect(() => {
        const interval = setInterval(() => {
            fetchPage(false);
        }, 2000)
        fetchPage();
        return () => {
            clearInterval(interval);
        }
    }, [fetchPage])

    const retryCallback = useCallback((sequence) => {
        callService(service, serviceUrl => fetch(`${serviceUrl}/dlq/items/${name}/${sequence}/retry`, {method: 'POST'}))
            .then(value => {
                if (value.ok) {
                    message.info('Sequence ' + sequence + ' has successfully been retried');
                } else {
                    message.error('Sequence ' + sequence + ' could not be processed fully. Check the server logs for more information!');
                }
                fetchPage()
            });
    }, [name, fetchPage, service])
    const evictFirstCallback = useCallback((sequence) => {
        callService(service, serviceUrl => fetch(`${serviceUrl}/dlq/items/${name}/${sequence}/evict/first`, {method: 'POST'}))
            .then(value => {
                if (value.ok) {
                    message.info('Sequence ' + sequence + ' has had first message evicted and retried successfully');
                } else {
                    message.error('Sequence ' + sequence + ' has had first message evicted but a later message was not processed correctly. Check the server logs for more information.');
                }
                fetchPage()
            });
    }, [name, fetchPage, service])
    const evictAllCallback = useCallback((sequence) => {
        callService(service, serviceUrl => fetch(`${serviceUrl}/dlq/items/${name}/${sequence}/evict/all`, {method: 'POST'}))
            .then(value => {
                if (value.ok) {
                    message.info('Sequence ' + sequence + ' has had  all messages evicted');
                } else {
                    message.error('Sequence ' + sequence + ' wasn\'t able to have its messages evicted. Check the server logs for more information.');
                }
                fetchPage()
            });
    }, [name, fetchPage, service])

    return <Card title={<Space direction={"horizontal"}>
        <Button onClick={() => history.goBack()}><ArrowLeftOutlined/></Button>
        Dead letter Queue: {name} {lstUpdated && <>(Last
        updated: {moment(lstUpdated).format("DD-MM-YYYY HH:mm:ss")})</>}</Space>}>
        {error ? 'An error occurred while fetching the DLQ. Please try again.' : ''}
        {!error && <div>
            <Table dataSource={sequences || []} rowKey={"sequence"}
                   loading={fetching}>
                <Table.Column title={"Sequence"} dataIndex={"sequence"}></Table.Column>
                <Table.Column title={"Last Touched"} dataIndex={"lastTouched"}
                              render={t => moment(t).format("DD-MM-YYYY HH:mm:ss")}></Table.Column>
                <Table.Column title={"Message type"} dataIndex="payloadType"></Table.Column>
                <Table.Column title={"Payload"} dataIndex="payload"
                              render={payload => <pre>{JSON.stringify(payload)}</pre>}></Table.Column>
                <Table.Column title={"Cause Type"} dataIndex="causeType"></Table.Column>
                <Table.Column title={"Cause Message"} dataIndex="causeMessage"></Table.Column>
                <Table.Column
                    title={<Popover content={"The number of messages blocked by this one"}>Blocked Messages</Popover>}
                    dataIndex="amount"></Table.Column>
                <Table.Column title={"Actions"} render={(row) => <div><ButtonGroup>
                    <Popover
                        content="Retry messages and other messages in the same sequence" placement={"left"}>
                        <Button type="default" onClick={() => retryCallback(row.sequence)}><RedoOutlined/></Button>
                    </Popover>

                    <Popover content="Evict first message and process other messages in the same sequence"
                             placement={"left"}>
                        <Popconfirm
                            title={`Are you sure you want to delete the first message and process the others?`}
                            onConfirm={() => {
                                evictFirstCallback(row.sequence)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="default" disabled={row.amount === 1}>
                                <FastForwardOutlined/>
                            </Button>
                        </Popconfirm>
                    </Popover>
                    <Popover content="Evict all messages in sequence" placement={"left"}>
                        <Popconfirm
                            title={`Are you sure you want to delete all messages in this sequence?`}
                            onConfirm={() => {
                                evictAllCallback(row.sequence)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="default">
                                <DeleteOutlined/>
                            </Button>
                        </Popconfirm>
                    </Popover>
                </ButtonGroup></div>}></Table.Column>
            </Table>
        </div>}
    </Card>
}
