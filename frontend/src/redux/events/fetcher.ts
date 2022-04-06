import store from "../store";
import {tailEvents} from "./EventsSlice";


export function startEventThread() {
    setInterval(() => {
        let events = store.getState().events;
        if (events.fetching || events.initialLoadingTail || events.currentIndex == null) {
            return;
        }
// @ts-ignore
        store.dispatch(tailEvents())
    }, 500)
}
