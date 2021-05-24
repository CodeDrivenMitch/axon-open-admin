import store from "../store";
import {fetchNodeInformation, fetchTokens} from "./TokenSlice";

let intervalTokens: any;
let intervalProcessors: any;

export function startTokenFetching() {
    intervalTokens = setInterval(() => store.dispatch(fetchTokens()), 2000)
    intervalProcessors = setInterval(() => store.dispatch(fetchNodeInformation()), 500)
}

export function stopTokenFetching() {
    if (intervalTokens) {
        clearInterval(intervalTokens)
    }
    if (intervalProcessors) {
        clearInterval(intervalProcessors)
    }
}
