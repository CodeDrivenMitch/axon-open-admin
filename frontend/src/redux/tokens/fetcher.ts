import store from "../store";
import {fetchNodeInformation, fetchTokens} from "./TokenSlice";

let intervalTokens: any;
let intervalProcessors: any;

export function startTokenFetching() {
// @ts-ignore TODO
    intervalTokens = setInterval(() => store.dispatch(fetchTokens()), 2000)
// @ts-ignore TODO
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
