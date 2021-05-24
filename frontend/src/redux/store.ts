import {combineReducers, configureStore} from "@reduxjs/toolkit";
import tokenSliceReducers from "./tokens/TokenSlice";
import eventStoreReducers from "./events/EventsSlice";

const store = configureStore({
    reducer: combineReducers({
        token: tokenSliceReducers,
        events: eventStoreReducers,
    })
})

export default store;
