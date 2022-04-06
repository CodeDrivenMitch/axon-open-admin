import {Button, Card, DatePicker, Form, Input, Radio, Space} from "antd";
import moment from "moment";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import EventTableContainer from "../components/events/EventTableContainer";
import {contextPath} from "../context";
import {
    applyConfiguration,
    clearConfiguration,
    EventTailingConfiguration,
    initialLoadingSelector
} from "../redux/events/EventsSlice";

export function EventExplorer() {
    const [form] = Form.useForm();
    const loading = useSelector(initialLoadingSelector)
    const [explorerType, setExplorerType] = useState("tailing")
    const [rangeIndexStart, setRangeIndexStart] = useState(null as null | number)
    const [rangeIndexEnd, setRangeIndexEnd] = useState(null as null | number)

    const calculateRange = useCallback(() => {
        if (form.getFieldValue("type") === "range" && form.getFieldValue("rangeDateStart") && form.getFieldValue("rangeDateEnd")) {
            console.log(form.getFieldValue("rangeDateStart"))
            fetch(encodeURI(`${contextPath}/index?sinceTime=${form.getFieldValue("rangeDateStart").utc().format('YYYY-MM-DDTHH:mm:ss')}Z`), {method: 'GET'})
                .then((res) => res.json(), () => setRangeIndexStart(null))
                .then(setRangeIndexStart);
            fetch(`${contextPath}/index?sinceTime=${form.getFieldValue("rangeDateEnd").utc().format('YYYY-MM-DDTHH:mm:ss')}Z`, {method: 'GET'})
                .then((res) => res.json(), () => setRangeIndexEnd(null))
                .then(setRangeIndexEnd);
        } else if (form.getFieldValue("type") === "tailing") {
            fetch(`${contextPath}/index`, {method: 'GET'})
                .then((res) => res.json(), () => setRangeIndexStart(null))
                .then((currentIndex) => {
                    setRangeIndexEnd(currentIndex);
                    const start = currentIndex - form.getFieldValue("tailingHistorySize");
                    setRangeIndexStart(start < 0 ? 0 : start)
                });

        }

    }, [form, setRangeIndexEnd, setRangeIndexStart])

    const onFormChange = useCallback((changedValues: Partial<EventTailingConfiguration>, values: EventTailingConfiguration) => {
        setExplorerType(values.type)
        calculateRange()
    }, [setExplorerType, calculateRange])

    const dispatch = useDispatch()
    const applyForm = async () => {
        dispatch(applyConfiguration({
            ...form.getFieldsValue(),
            rangeDateStart: form.getFieldValue("rangeDateStart").utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
            rangeDateEnd: form.getFieldValue("rangeDateEnd").utc().format(`YYYY-MM-DDTHH:mm:ss`) + 'Z',
        }))
    }

    useEffect(() => {
        calculateRange()
        const interval = setInterval(calculateRange, 5000)
        // Clear tailing configuration when navigating away
        return () => {
            dispatch(clearConfiguration())
            clearInterval(interval)
        }
    }, [calculateRange, dispatch])

    return <Card title={
        <div>Event Explorer</div>}>
        <Space direction={"vertical"} align={"start"}>
            <Space direction={"horizontal"} align={"start"}>
                <Form
                    labelCol={{span: 4}}
                    wrapperCol={{span: 14}}
                    form={form}
                    initialValues={{
                        type: "tailing",
                        tailingHistorySize: 500,
                        rangeDateStart: moment().add(-1, 'hours').startOf('minute'),
                        rangeDateEnd: moment().startOf('minute'),
                        aggregateId: ""
                    }}
                    onValuesChange={onFormChange}
                >
                    <h2>Configuration</h2>
                    <p>Configure the range of events you want to tail or fetch here. After applying we will load them in
                        batches of 100.</p>
                    <Form.Item label="Explorer type" name="type">
                        <Radio.Group>
                            <Radio.Button value="tailing">Tail event log</Radio.Button>
                            <Radio.Button value="range">Specific range</Radio.Button>
                            {/*<Radio.Button value="aggregate">Events for specific aggregate</Radio.Button>*/}
                        </Radio.Group>
                    </Form.Item>
                    {explorerType === "tailing" && <div>
                        <Form.Item label="Tailing history size" name={"tailingHistorySize"}>
                            <Input type={"number"}/>
                        </Form.Item>
                    </div>}
                    {explorerType === "range" && <div>
                        <Form.Item label="Date start" name={"rangeDateStart"}>
                            <DatePicker showTime  format={(v) => v.local().format("YYYY-MM-DD HH:mm:ss")}/>
                        </Form.Item>
                        <Form.Item label="Date end" name={"rangeDateEnd"}>
                            <DatePicker showTime format={(v) => v.local().format("YYYY-MM-DD HH:mm:ss")}/>
                        </Form.Item>

                        {(rangeIndexEnd == null || rangeIndexStart == null) &&
                        <p>Could not predict how many events we will fetch.</p>}
                    </div>}
                    <div>
                        {rangeIndexEnd != null && rangeIndexStart != null &&
                        <p>This range will fetch {rangeIndexEnd!! - rangeIndexStart!!} events
                            (index {rangeIndexStart} to {rangeIndexEnd}). <br/>
                            Beware of the load this can put on your application. Axon caches the last 10K events, but
                            can
                            and will fetch from your store as needed)</p>}
                        <Form.Item>
                            <Button type="primary" onClick={applyForm} loading={loading}>Apply configuration</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Space>

            <EventTableContainer/>
        </Space>
    </Card>;
}
