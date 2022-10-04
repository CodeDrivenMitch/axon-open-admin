import {BranchesOutlined, DatabaseOutlined} from "@ant-design/icons";

import {Layout, Menu, Typography} from "antd";
import 'antd/dist/antd.css';
import {Footer, Header} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, {useCallback, useEffect} from 'react';
import {Provider} from "react-redux";
import {BrowserRouter, Route, useHistory, useLocation} from "react-router-dom";
import {CommandProgressModal} from "./components/tokens/commands/CommandProgressModal";
import {contextPath} from "./context";
import {EventExplorer} from "./pages/EventExplorer";
import {ManagementPage} from "./pages/ManagementPage";
import store from "./redux/store";
import {
    startProcessorFetching,
    startTokenFetching,
    stopProcessorFetching,
    stopTokenFetching
} from "./redux/tokens/fetcher";

function AppMenu() {
    const history = useHistory();
    const location = useLocation();
    const onSelectCallback = useCallback(({key}) => {
        history.push(`${contextPath}/${key}`)
    }, [history])

    useEffect(() => {
        startTokenFetching()
        startProcessorFetching()
        return () => {
            stopTokenFetching()
            stopProcessorFetching()
        }
    }, [])

    const realUrl = location.pathname.startsWith(contextPath) ? location.pathname.substr(contextPath.length + 1) : location.pathname
    console.log(`Found page to be ${location.pathname} -> ${realUrl}`)
    const selectedKey = realUrl.length <= 1 ? "tokens" : realUrl;
    return <Menu
        mode="inline"
        defaultSelectedKeys={[selectedKey]}
        defaultOpenKeys={['/tokens']}
        onSelect={onSelectCallback}
        style={{height: '100%', borderRight: 0}}
    >
        <Menu.Item key="tokens"><BranchesOutlined/> Management</Menu.Item>
        <Menu.Item key="events"><DatabaseOutlined/> Event Explorer</Menu.Item>
    </Menu>;
}

function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Layout style={{minHeight: '100vh'}}>
                    <Header className="header">
                        <Typography.Title className={"title"} level={1}>Axon Open Admin</Typography.Title>
                    </Header>
                    <Layout>
                        <Sider width={200} className="site-layout-background">
                            <AppMenu/>
                        </Sider>
                        <Layout style={{padding: '0 24px 24px'}}>
                            <Layout.Content
                                className="site-layout-background"
                                style={{
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 280,
                                }}
                            >

                                <Route path={`${contextPath}/`} exact><ManagementPage/></Route>
                                <Route path={`${contextPath}/tokens`}><ManagementPage/></Route>
                                <Route path={[`${contextPath}/events`]} exact={false}><EventExplorer/></Route>

                                <CommandProgressModal/>
                            </Layout.Content>
                        </Layout>
                    </Layout>
                    <Footer>
                        <div style={{textAlign: 'center'}}>
                            <span>Axon Open Admin was built by <a target="_blank" rel="noreferrer" href={"https://github.com/Morlack"}>Mitchell Herrijgers</a></span>
                        </div>
                    </Footer>
                </Layout>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
