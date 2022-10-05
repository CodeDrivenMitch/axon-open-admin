import {DeleteOutlined, FastForwardOutlined, RedoOutlined} from "@ant-design/icons";
import {Button, Card, message, Popconfirm, Popover, Table} from "antd";
import ButtonGroup from "antd/es/button/button-group";
import moment from "moment";
import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {contextPath} from "../context";

interface DlqItem {
    sequence: string;
    amount: number;
    payload: any;
    causeType: string,
    causeMessage: string
}

export function DlqPage() {
    const {name} = useParams() as { name: string };
    const [sequences, setSequences] = useState(null as DlqItem[] | null)
    const [error, setError] = useState(false)
    const [fetching, setFetching] = useState(true)

    const fetchPage = useCallback(() => {
        setFetching(true);
        fetch(`${contextPath}/dlq/items/${name}`, {method: 'GET'})
            .then(value => {
                value.json().then(json => setSequences(json))
                setFetching(false)
            }, reason => setError(true));
    }, [setFetching, name])

    useEffect(() => {
        fetchPage();
    }, [fetchPage])

    const retryCallback = useCallback((sequence) => {
        fetch(`${contextPath}/dlq/items/${name}/${sequence}/retry`, {method: 'POST'})
            .then(value => {
                if (value.ok) {
                    message.info('Sequence ' + sequence + ' has successfully been retried');
                } else {
                    message.error('Sequence ' + sequence + ' could not be processed fully. Check the server logs for more information!');
                }
                fetchPage()
            });
    }, [name, fetchPage])
    const evictFirstCallback = useCallback((sequence) => {
        fetch(`${contextPath}/dlq/items/${name}/${sequence}/evict/first`, {method: 'POST'})
            .then(value => {
                if (value.ok) {
                    message.info('Sequence ' + sequence + ' has had first message evicted and retried successfully');
                } else {
                    message.error('Sequence ' + sequence + ' has had first message evicted but a later message was not processed correctly. Check the server logs for more information.');
                }
                fetchPage()
            });
    }, [name, fetchPage])
    const evictAllCallback = useCallback((sequence) => {
        fetch(`${contextPath}/dlq/items/${name}/${sequence}/evict/all`, {method: 'POST'})
            .then(value => {
                if (value.ok) {
                    message.info('Sequence ' + sequence + ' has had  all messages evicted');
                } else {
                    message.error('Sequence ' + sequence + ' wasn\'t able to have its messages evicted. Check the server logs for more information.');
                }
                fetchPage()
            });
    }, [name, fetchPage])

    return <Card title={<div>Dead letter Queue: {name}</div>}>
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
                            <Button type="default" disabled={row.amount === 1}>
                                <DeleteOutlined/>
                            </Button>
                        </Popconfirm>
                    </Popover>
                </ButtonGroup></div>}></Table.Column>
            </Table>
        </div>}
    </Card>
}
