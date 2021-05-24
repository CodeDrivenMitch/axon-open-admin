import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {contextPath} from "../../context";
import {NodeInformation, TokenInformationSummary} from "./models";

export interface TokenSliceState {
    information: TokenInformationSummary | null,
    knownNodes: {[name: string]: NodeInformation},
}

export const fetchTokens = createAsyncThunk(
    'tokens/get',
    async () => {
        let response = await fetch(contextPath + "/tokens", {method: 'GET'});
        if (response.ok) {
            return await response.json() as TokenInformationSummary
        }
        throw Error("Not logged in")
    }
)


export const fetchNodeInformation = createAsyncThunk(
    'node/get',
    async () => {
        let response = await fetch(contextPath + "/processors", {method: 'GET'});
        if (response.ok) {
            return await response.json()
        }
        throw Error("Not logged in")
    }
)

const tokenSlice = createSlice({
    name: '@token',
    initialState: {
        information: null,
        knownNodes: {}
    } as TokenSliceState,

    reducers: {},

    extraReducers: {
        [fetchTokens.fulfilled as unknown as string]: (state, action: PayloadAction<TokenInformationSummary>) => {
            state.information = action.payload
        },
        [fetchNodeInformation.fulfilled as unknown as string]: (state, action: PayloadAction<any>) => {
            const now = new Date().getTime()
            state.knownNodes[action.payload.nodeId] = {
                nodeId: action.payload.nodeId,
                lastSeen: now,
                processorStates: action.payload.processorStatuses
            }
            for(const node of Object.values(state.knownNodes)) {
                const secondsSince = Math.floor((now - node.lastSeen) / 1000)
                if(secondsSince > 60) {
                    delete state.knownNodes[node.nodeId]
                }
            }
        },
    }
});


export const tokenSliceSelector = ({token}: { token: TokenSliceState }) => token;
export const processorInformationSelector = createSelector(tokenSliceSelector, ({information}) => information)
export const nodeInformationSelector = createSelector(tokenSliceSelector, ({knownNodes}) => Object.values(knownNodes) as NodeInformation[])

export default tokenSlice.reducer
