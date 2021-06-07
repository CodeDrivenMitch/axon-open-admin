import {Table} from "antd";
import React from "react";
import {EventModel} from "../../redux/events/models";

function ProcessorTable({rows}: { rows: EventModel[] }) {
    const mappedRows = rows.map(row => Object.assign({}, row, {key: row.aggregate + '_' + row.index}))
    return (
        <Table dataSource={mappedRows} pagination={{pageSize: 20}} size={"small"} tableLayout={"fixed"}>
            <Table.Column title="Sequence" key="globalSequence" dataIndex="globalSequence"/>
            <Table.Column title="Aggregate" key="aggregate" dataIndex="aggregate"/>
            <Table.Column title="Index" key="index" dataIndex="index"/>
            <Table.Column title="Timestamp" key="timestamp" dataIndex="timestamp"/>
            <Table.Column title="Name" key="payloadType" dataIndex="payloadType"/>
            <Table.Column title="Payload" key="payload" dataIndex="payload" width={1000}/>
        </Table>
    );
}


export default ProcessorTable;
