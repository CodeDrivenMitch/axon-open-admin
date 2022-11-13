import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import _ from "lodash";
import moment from "moment";
import {services} from "../../context";
import {EventModel} from "./models";

export interface EventsSliceState {
    tail: EventModel[],
    configuration: EventTailingConfiguration | null,
    initialLoadingTail: boolean,
    currentIndex: number | null,
    maxIndex: number | null
    caughtUp: boolean,
    fetching: boolean,
    tailingPaused: boolean,
}

export interface EventTailingConfiguration {
    backend: string,
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

interface TailResult {
    items: EventModel[]
}

export const applyConfiguration = createAsyncThunk(
    'events/applyconfig',
    async (configuration: EventTailingConfiguration, {dispatch, extra}) => {
        if (configuration.type === "tailing") {
            const response = await fetch(`${services[configuration.backend]}/index`, {method: 'GET'});
            const index = await response.json()
            return {
                configuration,
                minIndex: index - configuration.tailingHistorySize < 0 ? 0 : index - configuration.tailingHistorySize,
            }
        }
        if (configuration.type === "range") {
            const response = await fetch(`${services[configuration.backend]}/index?sinceTime=${configuration.rangeDateStart}`, {method: 'GET'});
            const index = await response.json()
            return {
                configuration,
                minIndex: index,
            }
        }
        if (configuration.type === "aggregate") {
            return {
                configuration,
                aggregateId: configuration.aggregateId,
                minIndex: -1,
            }
        }
    }
)

export const tailEvents = createAsyncThunk(
    'events/get',
    async (_, {getState}) => {
        const state = (getState() as any).events as EventsSliceState;
        console.log(state)
        if (state.configuration?.type === "aggregate") {
            const response = await fetch(`${services[state.configuration.backend]}/events/${state.configuration.aggregateId}?sinceIndex=${(state.currentIndex === null ? -1 : state.currentIndex) + 1}`, {method: 'GET'});
            if (response.ok) {
                return {
                    items: await response.json() as EventModel[],
                    finite: true,
                }
            }
        }
        const response = await fetch(`${services[state.configuration!!.backend]}/events?sinceIndex=${state.currentIndex}`, {method: 'GET'});
        if (response.ok) {
            return {
                items: await response.json() as EventModel[],
                finite: false,
            }
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
        finite: false,
        tailingPaused: false,
    } as EventsSliceState,

    reducers: {
        clearConfiguration: (state) => {
            state.configuration = null
        },
        pauseTailing: (state) => {
            state.tailingPaused = true;
        },
        resumeTailing: (state) => {
            state.tailingPaused = false;
        },
        tailingCleared: (state) => {
            state.configuration = null
            state.tailingPaused = true;
            state.tail = []
        },
    },

    extraReducers: {
        [applyConfiguration.fulfilled as unknown as string]: (state, action: { payload: ApplyResult }) => {
            state.initialLoadingTail = false;
            state.configuration = action.payload.configuration
            state.currentIndex = action.payload.minIndex
            state.fetching = false;
            state.tailingPaused = false;
        },
        [applyConfiguration.pending as unknown as string]: (state) => {
            state.initialLoadingTail = true;
            state.tail = []
        },
        [tailEvents.pending as unknown as string]: (state) => {
            state.fetching = true;
        },
        [tailEvents.fulfilled as unknown as string]: (state, action: PayloadAction<TailResult>) => {
            const events = action.payload.items.concat(state.tail).slice(0, state.configuration?.tailingHistorySize)
            state.tail = events.filter(e => state.configuration?.type !== "range" || moment(e.timestamp).isBefore(moment(state.configuration?.rangeDateEnd)))
            if (state.configuration?.type === 'aggregate') {
                state.currentIndex = _.maxBy(state.tail, 'index')?.index ?? state.currentIndex ?? 0
            } else {
                state.currentIndex = _.maxBy(state.tail, 'globalSequence')?.globalSequence ?? state.currentIndex ?? 0
            }
            state.fetching = false
        },
    }
});


export const eventSliceSelector = ({events}: { events: EventsSliceState }) => events;
export const eventTailSelector = createSelector(eventSliceSelector, ({tail}) => tail)
export const caughtUpSelector = createSelector(eventSliceSelector, ({caughtUp}) => caughtUp)
export const initialLoadingSelector = createSelector(eventSliceSelector, ({initialLoadingTail}) => initialLoadingTail)
export const isActiveSelector = createSelector(eventSliceSelector, ({
                                                                        configuration,
                                                                        tailingPaused
                                                                    }) => configuration != null && !tailingPaused)
export const isPausedSelector = createSelector(eventSliceSelector, ({
                                                                        configuration,
                                                                        tailingPaused
                                                                    }) => configuration != null && tailingPaused)

export const {clearConfiguration, pauseTailing, resumeTailing, tailingCleared} = eventSlice.actions
export default eventSlice.reducer
