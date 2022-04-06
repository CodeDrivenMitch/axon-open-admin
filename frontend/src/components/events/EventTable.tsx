import {Modal, Space, Table} from "antd";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {contextPath} from "../../context";
import {caughtUpSelector} from "../../redux/events/EventsSlice";
import {EventModel} from "../../redux/events/models";

function ProcessorTable({rows}: { rows: EventModel[] }) {
    const [modalItem, setModalItem] = useState(null)
    const caughtUp = useSelector(caughtUpSelector)
    const mappedRows = rows.map(row => Object.assign({}, row, {key: row.aggregate + '_' + row.index}))
    return (
        <Space direction={"vertical"}>
            <div>
                Showing {mappedRows.length} events. {!caughtUp ? "Still catching up, stay tuned...": ""}
            </div>
            <Modal visible={modalItem != null} onOk={() => setModalItem(null)} onCancel={() => setModalItem(null)}>
                {modalItem}
            </Modal>
            <Table dataSource={mappedRows} pagination={{pageSize: 500}} size={"small"} tableLayout={"fixed"}>
                <Table.Column title="Sequence" key="globalSequence" dataIndex="globalSequence"/>
                <Table.Column title="Aggregate" key="aggregate" dataIndex="aggregate"
                              render={(id) => <Link to={contextPath + "/events/" + id}>{id}</Link>}/>
                <Table.Column title="Index" key="index" dataIndex="index"/>
                <Table.Column title="Timestamp" key="timestamp" dataIndex="timestamp"/>
                <Table.Column title="Name" key="payloadType" dataIndex="payloadType"/>
                <Table.Column title="Payload" key="payload" dataIndex="payload" render={(payload => <span className="eventExplorerPayload" onClick={() => setModalItem(payload)}>{payload}</span>)}/>
            </Table>
        </Space>
    );
}


export default ProcessorTable;
