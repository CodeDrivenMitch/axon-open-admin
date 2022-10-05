import {combineReducers, configureStore} from "@reduxjs/toolkit";
import dlqReducers from "./dlq/DlqSlice";
import eventStoreReducers from "./events/EventsSlice";
import tokenSliceReducers from "./tokens/TokenSlice";

const store = configureStore({
    reducer: combineReducers({
        token: tokenSliceReducers,
        events: eventStoreReducers,
        dlq: dlqReducers
    })
})

export default store;
