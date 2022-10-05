import {clearInterval} from "timers";
import store from "../store";
import {tailDlq} from "./DlqSlice";


let interval: any;

export function startDlqThread() {
    interval = setInterval(() => {
// @ts-ignore
        store.dispatch(tailDlq())
    }, 500)
}

export function stopDlqFetching() {
    if (interval) {
        clearInterval(interval)
        interval = null
    }
}
