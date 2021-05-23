import React from 'react';
import 'antd/dist/antd.css';

import 'react-toastify/dist/ReactToastify.css';
import {Layout, Typography} from "antd";
import Processors from "./components/Processors";


function App() {
    return (
        <Layout>
            <Layout.Header className="header">
                <Typography.Title className="logo" level={2}>Axon Open Admin</Typography.Title>
            </Layout.Header>
            <Layout.Content style={{padding: '10px'}}>
                <Processors/>
            </Layout.Content>
        </Layout>
    );
}

export default App;
