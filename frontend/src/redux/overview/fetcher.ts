import store from "../store";
import {fetchOverview} from "./slice";

let interval: any;

export function startOverviewFetching() {
    if (interval == null) {
// @ts-ignore TODO
        interval = setInterval(() => store.dispatch(fetchOverview()), 500)
    }
// @ts-ignore TODO
    store.dispatch(fetchOverview())
}

export function stopOverviewFetching() {
    if (interval) {
        clearInterval(interval)
        interval = null;
    }
}
