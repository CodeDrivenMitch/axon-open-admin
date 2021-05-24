import store from "../store";
import {fetchTokens} from "./TokenSlice";

let interval: any;

function fetchTokensProcess() {
    store.dispatch(fetchTokens())
}

export function startTokenFetching() {
    interval = setInterval(fetchTokensProcess, 2000)
}

export function stopTokenFetching() {
    if (interval) {
        clearInterval(interval)
    }
}
