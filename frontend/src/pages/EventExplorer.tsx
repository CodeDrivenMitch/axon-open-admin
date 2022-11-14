import {Button, Card, DatePicker, Form, Input, Radio, Space} from "antd";
import moment from "moment";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import EventTableContainer from "../components/events/EventTableContainer";
import {services} from "../context";
import {
    applyConfiguration,
    clearConfiguration,
    EventTailingConfiguration,
    initialLoadingSelector,
    isActiveSelector,
    isPausedSelector,
    pauseTailing,
    resumeTailing,
    tailingCleared
} from "../redux/events/EventsSlice";

export function EventExplorer() {
    const [form] = Form.useForm();
    const loading = useSelector(initialLoadingSelector)
    const tailingActive = useSelector(isActiveSelector)
    const isPaused = useSelector(isPausedSelector)
    const [backend, setBackend] = useState(Object.keys(services)[0])
    const [explorerType, setExplorerType] = useState("tailing")
    const [rangeIndexStart, setRangeIndexStart] = useState(null as null | number)
    const [rangeIndexEnd, setRangeIndexEnd] = useState(null as null | number)
    const dispatch = useDispatch()

    const calculateRange = useCallback(() => {
        if (form.getFieldValue("type") === "range" && form.getFieldValue("rangeDateStart") && form.getFieldValue("rangeDateEnd")) {
            fetch(encodeURI(`${services[backend]}/index?sinceTime=${form.getFieldValue("rangeDateStart").utc().format('YYYY-MM-DDTHH:mm:ss')}Z`), {method: 'GET'})
                .then((res) => res.json(), () => setRangeIndexStart(null))
                .then(setRangeIndexStart);
            fetch(`${services[backend]}/index?sinceTime=${form.getFieldValue("rangeDateEnd").utc().format('YYYY-MM-DDTHH:mm:ss')}Z`, {method: 'GET'})
                .then((res) => res.json(), () => setRangeIndexEnd(null))
                .then(setRangeIndexEnd);
        } else if (form.getFieldValue("type") === "tailing") {
            fetch(`${services[backend]}/index`, {method: 'GET'})
                .then((res) => res.json(), () => setRangeIndexStart(null))
                .then((currentIndex) => {
                    setRangeIndexEnd(currentIndex);
                    const start = currentIndex - form.getFieldValue("tailingHistorySize");
                    setRangeIndexStart(start < 0 ? 0 : start)
                });

        }

    }, [form, setRangeIndexEnd, setRangeIndexStart, backend])

    const onFormChange = useCallback((changedValues: Partial<EventTailingConfiguration>, values: EventTailingConfiguration) => {
        setExplorerType(values.type)
        if (values.backend !== backend) {
            dispatch(clearConfiguration())
            setBackend(values.backend)
        }
        if (values.type !== "aggregate") {
            calculateRange()
        }
    }, [setExplorerType, calculateRange, setBackend, dispatch, backend])

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
            dispatch(tailingCleared())
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
                        backend: backend,
                        type: "tailing",
                        tailingHistorySize: 500,
                        rangeDateStart: moment().add(-1, 'hours').startOf('minute'),
                        rangeDateEnd: moment().startOf('minute'),
                        aggregateId: null
                    }}
                    onValuesChange={onFormChange}
                >
                    <p>
                        The Event Explorer enables you to query the events in your store. Unless a specific date range
                        is configured, it will
                        constantly tail for new events that were published to the event store. You can also tail a
                        specific aggregate's events.
                    </p>
                    <Form.Item label="Backend" name="backend">
                        <Radio.Group>
                            {Object.keys(services).map(server => <Radio.Button key={server}
                                                                               value={server}>{server}</Radio.Button>)}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Explorer type" name="type">
                        <Radio.Group>
                            <Radio.Button value="tailing">Tail</Radio.Button>
                            <Radio.Button value="range">Time range</Radio.Button>
                            <Radio.Button value="aggregate">Specific aggregate</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {explorerType === "tailing" && <div>
                        <Form.Item label="Tailing history size" name={"tailingHistorySize"}>
                            <Input type={"number"}/>
                        </Form.Item>
                    </div>}
                    {explorerType === "aggregate" && <div>
                        <Form.Item label="Identifier" name={"aggregateId"} required={true}>
                            <Input type={"text"}/>
                        </Form.Item>
                    </div>}
                    {explorerType === "range" && <div>
                        <Form.Item label="Date start" name={"rangeDateStart"}>
                            <DatePicker showTime format={(v) => v.local().format("YYYY-MM-DD HH:mm:ss")}/>
                        </Form.Item>
                        <Form.Item label="Date end" name={"rangeDateEnd"}>
                            <DatePicker showTime format={(v) => v.local().format("YYYY-MM-DD HH:mm:ss")}/>
                        </Form.Item>

                        {(rangeIndexEnd == null || rangeIndexStart == null) &&
                            <p>Could not predict how many events we will fetch.</p>}
                    </div>}
                    {explorerType !== "aggregate" && <div>
                        {rangeIndexEnd != null && rangeIndexStart != null &&
                            <p>This range will fetch {rangeIndexEnd!! - rangeIndexStart!!} events
                                (index {rangeIndexStart} to {rangeIndexEnd}).</p>}
                    </div>}
                    <Form.Item>
                        <Button type="primary" onClick={applyForm} loading={loading}>Apply configuration</Button>
                        {tailingActive &&
                            <Button type="default" onClick={() => dispatch(pauseTailing())}>Pause</Button>}
                        {isPaused && <Button type="default" onClick={() => dispatch(resumeTailing())}>Resume</Button>}
                    </Form.Item>
                </Form>
            </Space>

            <EventTableContainer aggregateSelectionCallback={(identifier) => {
                dispatch(clearConfiguration())
                form.setFields([
                    {name: 'type', value: 'aggregate'},
                    {name: 'aggregateId', value: identifier}
                ]);
                setExplorerType('aggregate')
                applyForm();
            }}/>
        </Space>
    </Card>;
}
