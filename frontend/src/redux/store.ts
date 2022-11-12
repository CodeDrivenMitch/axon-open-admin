import {combineReducers, configureStore} from "@reduxjs/toolkit";
import commandSliceReducers from "./command/slice";
import eventStoreReducers from "./events/EventsSlice";
import overviewSliceReducers from "./overview/slice";

const store = configureStore({
    reducer: combineReducers({
        command: commandSliceReducers,
        events: eventStoreReducers,
        overview: overviewSliceReducers,
    })
})

export default store;
