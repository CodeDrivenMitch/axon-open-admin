import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {contextPath} from "../../context";
import {NodeInformation} from "./models";

export interface TokenSliceState {
    knownNodes: {[name: string]: NodeInformation},
    commandProgress: CommandProgress[],
    commandProgressOpen: boolean
    commandsFinished: boolean
}

export interface CommandProgress {
    description: string,
    loading: boolean,
    success: boolean
    error: string | null
    attempt: number | null
}


export const fetchNodeInformation = createAsyncThunk(
    'node/get',
    async () => {
        let response = await fetch(`${contextPath}/processors`, {method: 'GET'});
        if (response.ok) {
            return await response.json()
        }
        throw Error("Not logged in")
    }
)

const tokenSlice = createSlice({
    name: '@token',
    initialState: {
        knownNodes: {},
    } as TokenSliceState,

    reducers: {

        closeProgressModal: (state) => {
            state.commandProgress = []
            state.commandProgressOpen = false
        },
        openProgressModal(state) {
            state.commandProgressOpen = true
        },
        updateProgressModal(state, action: PayloadAction<CommandProgress[]>) {
            state.commandProgress = action.payload
            state.commandsFinished = false
        },
        reportCommandsFinished(state) {
            state.commandsFinished = true
        }
    },

    extraReducers: {
        [fetchNodeInformation.fulfilled as unknown as string]: (state, action: PayloadAction<any>) => {
            const now = new Date().getTime()
            state.knownNodes[action.payload.nodeId] = {
                nodeId: action.payload.nodeId,
                lastSeen: now,
                processorStates: action.payload.processorStatuses.map((m: any) => ({
                    ...m,
                    nodeId: action.payload.nodeId
                }))
            }
            for(const node of Object.values(state.knownNodes)) {
                const secondsSince = Math.floor((now - node.lastSeen) / 1000)
                if (secondsSince > 2) {
                    delete state.knownNodes[node.nodeId]
                }
            }
        },
    }
});


export const tokenSliceSelector = ({token}: { token: TokenSliceState }) => token;
export const nodeInformationSelector = createSelector(tokenSliceSelector, ({knownNodes}) => Object.values(knownNodes) as NodeInformation[])
export const progressModalOpened = createSelector(tokenSliceSelector, ({commandProgressOpen}) => commandProgressOpen)
export const progressItems = createSelector(tokenSliceSelector, ({commandProgress}) => commandProgress)
export const commandsFinished = createSelector(tokenSliceSelector, ({commandsFinished}) => commandsFinished)

export default tokenSlice.reducer

export const {closeProgressModal, updateProgressModal, reportCommandsFinished, openProgressModal} = tokenSlice.actions
