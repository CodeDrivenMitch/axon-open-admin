import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {backendServers} from "../../context";
import {BackendInformation, NodeInformation} from "./models";

export interface OverviewSliceState {
    knownNodes: { [name: string]: NodeInformation },
    backendStatus: { [name: string]: BackendInformation },
}

export const fetchOverview = createAsyncThunk(
    'overview/get',
    async () => {
        const results: { [name: string]: any } = {}
        for (const backendServer in backendServers) {
            try {
                let response = await fetch(`${backendServers[backendServer]}/overview`, {method: 'GET'});
                if (response.ok) {
                    results[backendServer] = {
                        success: true,
                        content: await response.json()
                    }
                    continue;
                }
            } catch (e) {
                // Do nothing
            }
            results[backendServer] = {
                success: false,
            }
        }
        return results
    }
)

const slice = createSlice({
    name: '@overview',
    initialState: {
        knownNodes: {},
        backendStatus: Object.keys(backendServers).reduce((previousValue, currentValue) => ({
            ...previousValue,
            [currentValue]: {backendName: currentValue, online: false, nodes: {}}
        }), {}),
    } as OverviewSliceState,

    reducers: {},

    extraReducers: {
        [fetchOverview.fulfilled as unknown as string]: (state, action: PayloadAction<{ [name: string]: any }>) => {
            const now = new Date().getTime()
            for (const backend in action.payload) {
                const {success, content} = action.payload[backend]
                if (!success) {
                    state.backendStatus[backend].online = false
                    continue;
                }
                state.backendStatus[backend].online = true
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
