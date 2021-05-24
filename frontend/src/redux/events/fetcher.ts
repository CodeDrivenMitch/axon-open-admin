import store from "../store";
import {fetchEvents} from "./EventsSlice";

let intervalEvents: any;

export function startEventFetching() {
// @ts-ignore TODO
    intervalEvents = setInterval(() => store.dispatch(fetchEvents()), 1000)
}

export function stopEventFetching() {
    if (intervalEvents) {
        clearInterval(intervalEvents)
    }
}
