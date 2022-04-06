import store from "../store";
import {fetchNodeInformation, fetchTokens} from "./TokenSlice";

let intervalTokens: any;
let intervalProcessors: any;

export function startTokenFetching() {
    if(intervalTokens == null) {
// @ts-ignore TODO
        intervalTokens = setInterval(() => store.dispatch(fetchTokens()), 500)
    }
// @ts-ignore TODO
    store.dispatch(fetchTokens())
}

export function startProcessorFetching() {
    if(intervalProcessors == null) {
// @ts-ignore TODO
        intervalProcessors = setInterval(() => store.dispatch(fetchNodeInformation()), 500)
    }
// @ts-ignore TODO
    store.dispatch(fetchNodeInformation())
}

export function stopTokenFetching() {
    if (intervalTokens) {
        clearInterval(intervalTokens)
        intervalTokens = null
    }
}

export function stopProcessorFetching() {
    if (intervalProcessors) {
        clearInterval(intervalProcessors)
        intervalProcessors = null;
    }
}
