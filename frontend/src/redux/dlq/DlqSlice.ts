import {createAsyncThunk, createSelector, createSlice} from '@reduxjs/toolkit'
import {contextPath} from "../../context";

export interface DlqOverviewInfo {
    numberOfSequences: number,
    numberOfMessages: number,
}

export interface DlqSliceState {
    processorItemCount: { [name: string]: DlqOverviewInfo },
}


export const fetchItems = createAsyncThunk(
    'dlq/getItems',
    async (processor: string) => {
        const response = await fetch(`${contextPath}/dlq/items/${processor}`, {method: 'GET'});
        return await response.json()
    }
)

export const tailDlq = createAsyncThunk(
    'dlq/get',
    async (_, {getState}) => {
        const response = await fetch(`${contextPath}/dlq/overview`, {method: 'GET'});
        return response.json();
    }
)

const dlqSlice = createSlice({
    name: '@dlq',
    initialState: {
        processorItemCount: {},
    } as DlqSliceState,

    reducers: {},

    extraReducers: {
        [tailDlq.fulfilled as unknown as string]: (state, action: { payload: { [name: string]: DlqOverviewInfo } }) => {
            state.processorItemCount = action.payload
        },
    }
});


export const dlqSliceSelector = ({dlq}: { dlq: DlqSliceState }) => dlq;
export const dlqCountSelector = createSelector(dlqSliceSelector, ({processorItemCount}) => processorItemCount)

export default dlqSlice.reducer
