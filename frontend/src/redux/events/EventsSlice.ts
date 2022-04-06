import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import _ from "lodash";
import moment from "moment";
import {contextPath} from "../../context";
import {EventModel} from "./models";

export interface EventsSliceState {
    tail: EventModel[],
    configuration: EventTailingConfiguration | null,
    initialLoadingTail: boolean,
    currentIndex: number | null,
    maxIndex: number | null
    caughtUp: boolean,
    fetching: boolean,
}

export interface EventTailingConfiguration {
    type: "range" | "aggregate" | "tailing",
    tailingHistorySize: number,
    rangeDateStart: string,
    rangeDateEnd: string,
    aggregateId: string,
}

interface ApplyResult {
    configuration: EventTailingConfiguration,
    minIndex: number,
}

export const applyConfiguration = createAsyncThunk(
    'events/applyconfig',
    async (configuration: EventTailingConfiguration, {dispatch, extra}) => {
        if (configuration.type === "tailing") {
            const response = await fetch(`${contextPath}/index`, {method: 'GET'});
            const index = await response.json()
            return {
                configuration,
                minIndex: index - configuration.tailingHistorySize < 0 ? 0 : index - configuration.tailingHistorySize
            }
        }
        if(configuration.type === "range") {
            const response = await fetch(`${contextPath}/index?sinceTime=${configuration.rangeDateStart}`, {method: 'GET'});
            const index = await response.json()
            return {
                configuration,
                minIndex: index
            }
        }
    }
)

export const tailEvents = createAsyncThunk(
    'events/get',
    async (_, {getState}) => {
        const state = (getState() as any).events as EventsSliceState;
        console.log(state.currentIndex)
        const response = await fetch(`${contextPath}/events?sinceIndex=${state.currentIndex}`, {method: 'GET'});
        if (response.ok) {
            return await response.json() as EventModel[]
        }
        return [];
    }
)

const eventSlice = createSlice({
    name: '@event',
    initialState: {
        tail: [],
        configuration: null,
        initialLoadingTail: false,
        currentIndex: null,
        maxIndex: null,
        caughtUp: true,
        fetching: false,
    } as EventsSliceState,

    reducers: {
        clearConfiguration: (state) => {
            state.configuration = null
        },
    },

    extraReducers: {
        [applyConfiguration.fulfilled as unknown as string]: (state, action: { payload: ApplyResult }) => {
            state.initialLoadingTail = false;
            state.configuration = action.payload.configuration
            state.currentIndex = action.payload.minIndex
            state.caughtUp = false;
            state.fetching = false;
        },
        [applyConfiguration.pending as unknown as string]: (state) => {
            state.initialLoadingTail = true;
            state.tail = []
        },
        [tailEvents.pending as unknown as string]: (state) => {
            state.fetching = true;
        },
        [tailEvents.fulfilled as unknown as string]: (state, action: PayloadAction<EventModel[]>) => {
            const events = action.payload.concat(state.tail).slice(0, state.configuration?.tailingHistorySize)
            state.tail = events.filter(e => state.configuration?.type !== "range" || moment(e.timestamp).isBefore(moment(state.configuration?.rangeDateEnd)))
            const lastIndex = _.maxBy(state.tail, 'globalSequence')?.globalSequence ?? state.currentIndex ?? 0
            if (lastIndex - (state.currentIndex ?? 0) < 50) {
                state.caughtUp = true;
            }
            state.currentIndex = lastIndex
            state.fetching = false
        },
    }
});


export const eventSliceSelector = ({events}: { events: EventsSliceState }) => events;
export const eventTailSelector = createSelector(eventSliceSelector, ({tail}) => tail)
export const caughtUpSelector = createSelector(eventSliceSelector, ({caughtUp}) => caughtUp)
export const initialLoadingSelector = createSelector(eventSliceSelector, ({initialLoadingTail}) => initialLoadingTail)

export const {clearConfiguration} = eventSlice.actions
export default eventSlice.reducer
