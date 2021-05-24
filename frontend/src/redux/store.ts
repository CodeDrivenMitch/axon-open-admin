import {combineReducers, configureStore} from "@reduxjs/toolkit";
import tokenSliceReducers from "./tokens/TokenSlice";

const store = configureStore({
    reducer: combineReducers({
        token: tokenSliceReducers,
    })
})

export default store;
