import React, {useEffect} from 'react';
import 'antd/dist/antd.css';

import {Card, Layout, Popover, Space, Typography} from "antd";
import {Provider} from "react-redux";
import store from "./redux/store";
import TokenStatusContainer from "./components/tokens/TokenStatusContainer";
import {startTokenFetching, stopTokenFetching} from "./redux/tokens/fetcher";
import ProcessorStatusContainer from "./components/processors/ProcessorStatusContainer";
import {QuestionCircleOutlined} from "@ant-design/icons";
import EventTableContainer from "./components/events/EventTableContainer";

function App() {
    useEffect(() => {
        startTokenFetching()
        return () => stopTokenFetching()
    }, [])
    return (
        <Provider store={store}>
            <Layout>
                <Layout.Header className="header">
                    <Typography.Title className="logo" level={2}>Axon Open Admin</Typography.Title>
                </Layout.Header>
                <Layout.Content style={{padding: '10px'}}>
                    <Space direction={"vertical"}>
                        <Card title={<div>
                            <Popover
                                placement={"right"}
                                style={{float: 'right'}}
                                content={
                                    <Typography.Text>Here you can find the status of the segments of each token. You can find a description of each possible action by hovering over it. Good luck!</Typography.Text>}>
                                <QuestionCircleOutlined /></Popover>  Token status
                        </div>}>
                            <TokenStatusContainer/>
                        </Card>
                        <Card title={<div>
                            <Popover
                                placement={"right"}
                                style={{float: 'right'}}
                                content={
                                    <Typography.Text>Here you can find the status of the nodes we have discovered through firing rest calls at your back-ends. Don't worry,
                                        they
                                        are lightning-fast calls with little performance impact. Each time a node is discovered, or is lost, the table is
                                        updated.</Typography.Text>}>
                                <QuestionCircleOutlined /></Popover>  Processor status
                        </div>}>
                            <Space direction={"vertical"}>
                                <ProcessorStatusContainer/>
                            </Space>
                        </Card>

                        <Card title={<div>Last 50 events</div>}>
                            <Space direction={"vertical"}>
                                <EventTableContainer/>
                            </Space>
                        </Card>
                    </Space>
                </Layout.Content>
            </Layout>
        </Provider>
    );
}

export default App;
