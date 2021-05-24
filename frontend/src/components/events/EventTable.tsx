import {Popover, Space, Table, Tag} from "antd";
import React from "react";
import {NodeInformation} from "../../redux/tokens/models";
import {EventModel} from "../../redux/events/models";

function ProcessorTable({rows}: { rows: EventModel[] }) {
    const mappedRows = rows.map(row => Object.assign({}, row, {key: row.aggregate + '_' + row.index}))
    return (
        <Table dataSource={mappedRows} pagination={{pageSize: 20}} size={"small"}>
            <Table.Column title="Aggregate" key="aggregate" dataIndex="aggregate"/>
            <Table.Column title="Aggregate" key="index" dataIndex="index"/>
            <Table.Column title="Timestamp" key="timestamp" dataIndex="timestamp"/>
            <Table.Column title="Name" key="payloadType" dataIndex="payloadType"/>
            <Table.Column title="Payload" key="payload" dataIndex="payload"/>
        </Table>
    );
}


export default ProcessorTable;
