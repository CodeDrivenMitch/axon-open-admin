import {Modal, Space, Table} from "antd";
import moment from "moment";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {caughtUpSelector, isPausedSelector} from "../../redux/events/EventsSlice";
import {EventModel} from "../../redux/events/models";

function ProcessorTable({
                            rows,
                            aggregateSelectionCallback
                        }: { rows: EventModel[], aggregateSelectionCallback: (identifier: string) => void }) {
    const [modalItem, setModalItem] = useState(null)
    const caughtUp = useSelector(caughtUpSelector)
    const paused = useSelector(isPausedSelector)
    const mappedRows = rows.map(row => Object.assign({}, row, {key: row.aggregate + '_' + row.index}))
    return (
        <Space direction={"vertical"}>
            <div>
                Showing {mappedRows.length} events. {!caughtUp && !paused ? "Still catching up, stay tuned..." : ""} {paused ? "Tailing currently paused." : ""}
            </div>
            <Modal visible={modalItem != null} onOk={() => setModalItem(null)} onCancel={() => setModalItem(null)}>
                <pre>{modalItem}</pre>
            </Modal>
            <Table dataSource={mappedRows} pagination={{pageSize: 500}} size={"small"} tableLayout={"fixed"}>
                <Table.Column title="Index" key="globalSequence"
                              width={200}
                              render={({globalSequence, timestamp}) => <div>Global
                                  index: {globalSequence}<br/>{moment(timestamp).format('DD-MM-YYYY - HH:mm:ss')}
                              </div>}/>
                <Table.Column title="Aggregate" key="aggregate"
                              width={300}
                              render={({aggregate, index}) => {
                                  if (!aggregate) {
                                      return <div>-</div>
                                  }
                                  return <div><Link
                                      to={'#'}
                                      onClick={() => aggregateSelectionCallback(aggregate)}>{aggregate}</Link><br/> Sequence
                                      number: {index}</div>;
                              }}/>
                <Table.Column title="Payload" key="payload" render={(({payload, payloadType}) => {
                    let formattedPayload = JSON.stringify(payload, null, 4);
                    return <span className="eventExplorerPayload"
                                 onClick={() => setModalItem(formattedPayload as any)}>{payloadType}
                        <pre>{formattedPayload}</pre></span>;
                })}/>
            </Table>
        </Space>
    );
}


export default ProcessorTable;
