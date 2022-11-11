import store from "../store";
import {fetchNodeInformation} from "./TokenSlice";

let intervalProcessors: any;

export function startProcessorFetching() {
    if(intervalProcessors == null) {
// @ts-ignore TODO
        intervalProcessors = setInterval(() => store.dispatch(fetchNodeInformation()), 500)
    }
// @ts-ignore TODO
    store.dispatch(fetchNodeInformation())
}

export function stopProcessorFetching() {
    if (intervalProcessors) {
        clearInterval(intervalProcessors)
        intervalProcessors = null;
    }
}
