import React from 'react';
import 'antd/dist/antd.css';

import {Card, Layout, Typography} from "antd";
import {Provider} from "react-redux";
import store from "./redux/store";
import TokenStatusContainer from "./components/tokens/TokenStatusContainer";

function App() {
    return (
        <Provider store={store}>
            <Layout>
                <Layout.Header className="header">
                    <Typography.Title className="logo" level={2}>Axon Open Admin</Typography.Title>
                </Layout.Header>
                <Layout.Content style={{padding: '10px'}}>
                    <Card title={"Token status"}>
                        <TokenStatusContainer/>
                    </Card>
                </Layout.Content>
            </Layout>
        </Provider>
    );
}

export default App;
