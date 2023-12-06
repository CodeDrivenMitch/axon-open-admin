import {BranchesOutlined, DatabaseOutlined, RedEnvelopeOutlined} from "@ant-design/icons";

import {Alert, Layout, Menu, Space, Typography} from "antd";
import 'antd/dist/antd.css';
import {Footer, Header} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, {useCallback, useEffect} from 'react';
import {Provider, useSelector} from "react-redux";
import {BrowserRouter, Route, useHistory, useLocation} from "react-router-dom";
import {CommandProgressModal} from "./components/processors/commands/CommandProgressModal";
import {contextPath, services} from "./context";
import {DlqPage} from "./pages/DlqPage";
import {EventExplorer} from "./pages/EventExplorer";
import {ManagementPage} from "./pages/ManagementPage";
import {MessageStatsPage} from "./pages/MessageStatsPage";
import {startEventThread, stopEventFetching} from "./redux/events/fetcher";
import {startOverviewFetching, stopOverviewFetching,} from "./redux/overview/fetcher";
import {offlineBackendsSelector} from "./redux/overview/slice";
import store from "./redux/store";

function AppMenu() {
    const history = useHistory();
    const location = useLocation();
    const onSelectCallback = useCallback(({key}) => {
        if (key === "as") {
            return;
        }
        history.push(`${contextPath}/${key}`)
    }, [history])

    useEffect(() => {
        startOverviewFetching()
        startEventThread()
        return () => {
            try {
                stopOverviewFetching()
                stopEventFetching()
            } catch (e) {
                //Ignore
            }
        }
    }, [])

    const realUrl = location.pathname.startsWith(contextPath) ? location.pathname.substr(contextPath.length + 1) : location.pathname
    const selectedKey = realUrl || "tokens";
    return <Menu
        mode="inline"
        defaultSelectedKeys={[selectedKey]}
        defaultOpenKeys={['/tokens']}
        onSelect={onSelectCallback}
        style={{height: '100%', borderRight: 0}}
    >
        <Menu.Item key="tokens"><BranchesOutlined/> Processors</Menu.Item>
        <Menu.Item key="stats"><RedEnvelopeOutlined/> Message stats</Menu.Item>
        <Menu.Item key="events"><DatabaseOutlined/> Event Explorer</Menu.Item>

        <Menu.Divider/>
        <Menu.Item key={"as"}>
            <p><a target={"_blank"} rel="noreferrer" href={"https://www.axoniq.io/"}>Try Axon Server</a></p>
        </Menu.Item>

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
                                <Space direction={"vertical"} size={"large"}>
                                    <OfflineBackendsAlert/>
                                    <AxoniqConsoleAlert/>

                                    <Route path={`${contextPath}/`} exact><ManagementPage/></Route>
                                    <Route path={`${contextPath}/tokens`}><ManagementPage/></Route>
                                    <Route path={`${contextPath}/stats`}><MessageStatsPage/></Route>
                                    <Route path={[`${contextPath}/events`]} exact={false}><EventExplorer/></Route>
                                    <Route path={[`${contextPath}/dlq/:service/:name`]} exact={false}><DlqPage/></Route>
                                </Space>

                                <CommandProgressModal/>
                            </Layout.Content>
                        </Layout>
                    </Layout>
                    <Footer>
                        <div style={{textAlign: 'center'}}>
                            <span>Axon Open Admin was built by <a target="_blank" rel="noreferrer"
                                                                  href={"https://code-driven-mitch.dev"}>Mitchell Herrijgers</a></span>
                        </div>
                    </Footer>
                </Layout>
            </Provider>
        </BrowserRouter>
    );
}

function OfflineBackendsAlert() {
    const offlineBackends = useSelector(offlineBackendsSelector)
    if (offlineBackends.length > 0) {
        return <Alert message="Offline backend servers" type="warning" showIcon
                      description={<div>
                          Data might be incomplete because the following backends are could not be reached:
                          <ul>
                              {offlineBackends.map(be => <li key={be}>{be}: {services[be].join(", ")}</li>)}
                          </ul>
                      </div>}>
        </Alert>
    }

    return <></>
}

function AxoniqConsoleAlert() {
    return <Alert message="AxonIQ Console" type="info" showIcon
                  description={<div>
                      Have you tried <a target="_blank" rel="noreferrer"
                                        href={"https://www.axoniq.io/products/axoniq-console"}>Axoniq Console</a>? It's
                      your one-stop-shop for all your Axon needs. It includes anything Axon Open Admin provides, and
                      much more. Event processor load balancing, persistent metrics, message diagrams, autoscaling and
                      much more. Check it out!
                  </div>}/>
}

export default App;
