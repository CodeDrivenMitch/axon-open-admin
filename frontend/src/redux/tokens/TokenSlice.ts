import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {contextPath} from "../../context";
import {TokenInformationSummary} from "./models";

export interface TokenSliceState {
    information: TokenInformationSummary | null,
}

export const fetchTokens = createAsyncThunk(
    'tokens/get',
    async () => {
        let response = await fetch(contextPath + "/tokens", {method: 'GET'});
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
    } as TokenSliceState,

    reducers: {},

    extraReducers: {
        [fetchTokens.fulfilled as unknown as string]: (state, action: PayloadAction<TokenInformationSummary>) => {
            state.information = action.payload
        },
    }
});


export const tokenSliceSelector = ({token}: { token: TokenSliceState }) => token;
export const processorInformationSelector = createSelector(tokenSliceSelector, ({information}) => information)

export default tokenSlice.reducer
