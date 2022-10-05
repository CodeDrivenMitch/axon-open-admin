import {clearInterval} from "timers";
import store from "../store";
import {tailEvents} from "./EventsSlice";

let interval: any;

export function startEventThread() {
    interval = setInterval(() => {
        let events = store.getState().events;
        if (events.fetching || events.initialLoadingTail || events.currentIndex == null || events.tailingPaused) {
            return;
        }
// @ts-ignore
        store.dispatch(tailEvents())
    }, 500)
}

export function stopEventFetching() {
    if (interval) {
        clearInterval(interval)
        interval = null
    }
}
