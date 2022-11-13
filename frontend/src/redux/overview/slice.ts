import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {services} from "../../context";
import {BackendInformation, NodeInformation} from "./models";

export interface OverviewSliceState {
    knownNodes: { [name: string]: NodeInformation },
    backendStatus: { [name: string]: BackendInformation },
}

export const fetchOverview = createAsyncThunk(
    'overview/get',
    async () => {
        const results: { [name: string]: any } = {}
        for (const service in services) {
            results[service] = {
                success: false,
                contents: []
            }
            for (const backend of services[service]) {
                try {
                    let response = await fetch(`${backend}/overview`, {method: 'GET'});
                    if (response.ok) {
                        results[service].success = true;
                        results[service].contents.push(await response.json());
                    }
                } catch (e) {
                    // Do nothing
                }
            }
        }
        return results
    }
)

const slice = createSlice({
    name: '@overview',
    initialState: {
        knownNodes: {},
        backendStatus: Object.keys(services).reduce((previousValue, currentValue) => ({
            ...previousValue,
            [currentValue]: {backendName: currentValue, online: false, nodes: {}}
        }), {}),
    } as OverviewSliceState,

    reducers: {},

    extraReducers: {
        [fetchOverview.fulfilled as unknown as string]: (state, action: PayloadAction<{ [name: string]: any }>) => {
            const now = new Date().getTime()
            for (const backend in action.payload) {
                const {success, contents} = action.payload[backend]
                if (!success) {
                    state.backendStatus[backend].online = false
                    continue;
                }
                state.backendStatus[backend].online = true
                for (const content of contents) {
                    state.backendStatus[backend].nodes[content.nodeId] = {
                        nodeId: content.nodeId,
                        lastSeen: now,
                        service: content.service
                    };

                    state.knownNodes[content.nodeId] = {
                        nodeId: content.nodeId,
                        service: backend,
                        processors: content.processors.map((m: any) => ({
                            ...m,
                            nodeId: content.nodeId
                        }))
                    }
                }
            }
            for (const backend of Object.values(state.backendStatus)) {
                for (const node of Object.values(backend.nodes)) {
                    const secondsSince = Math.floor((now - node.lastSeen) / 1000)
                    if (secondsSince > 10) {
                        delete state.backendStatus[backend.backendName].nodes[node.nodeId]
                        delete state.knownNodes[node.nodeId]
                    }
                }
            }
        },
    }
});


export const overviewSliceSelector = ({overview}: { overview: OverviewSliceState }) => overview;
export const nodeInformationSelector = createSelector(overviewSliceSelector, ({knownNodes}) => Object.values(knownNodes) as NodeInformation[])
export const offlineBackendsSelector = createSelector(overviewSliceSelector, ({backendStatus}) => Object.keys(backendStatus).filter(name => !backendStatus[name].online))

export default slice.reducer
