import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {contextPath} from "../../context";
import {EventModel} from "./models";

export interface EventsSliceState {
    tail: EventModel[]
}

export const fetchEvents = createAsyncThunk(
    'events/get',
    async () => {
        let response = await fetch(contextPath + "/events", {method: 'GET'});
        if (response.ok) {
            return await response.json() as EventModel[]
        }
        throw Error("Not logged in")
    }
)

const eventSlice = createSlice({
    name: '@event',
    initialState: {
        tail: []
    } as EventsSliceState,

    reducers: {},

    extraReducers: {
        [fetchEvents.fulfilled as unknown as string]: (state, action: PayloadAction<EventModel[]>) => {
            state.tail = action.payload
        },
    }
});


export const eventSliceSelector = ({events}: { events: EventsSliceState }) => events;
export const eventTailSelector = createSelector(eventSliceSelector, ({tail}) => tail)

export default eventSlice.reducer
