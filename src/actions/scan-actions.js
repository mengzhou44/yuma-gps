
import { ipcRenderer } from "electron";
import moment from "moment";
import * as types from "./types";


export function startScan({ clients, clientId, jobId }) {
    return function (dispatch) {
        ipcRenderer.send("scan:start");
        const payload = {
            clients,
            clientId,
            jobId,
            created: Math.floor(Date.now())
        };
        dispatch({ type: types.SCAN_STARTED, payload });
        ipcRenderer.on("mat:found", (event, progress) => {
            dispatch({ type: types.MAT_FOUND, payload: progress });
        });
    };
}

export function stopScan() {
    return function (dispatch) {
        ipcRenderer.send("scan:stop");
        ipcRenderer.removeAllListeners("mat:found");
        dispatch({ type: types.SCAN_STOPPED });
    };
}

export function resetScanStatus() {
    return function (dispatch) {
        dispatch({ type: types.SCAN_STATUS_RESET });
        ipcRenderer.removeAllListeners("mat:found");
    };
}

export function resumeScan() {
    return function (dispatch) {
        ipcRenderer.send("scan:resume");
        ipcRenderer.on("mat:found", (event, progress) => {
            dispatch({ type: types.MAT_FOUND, payload: progress });
        });
        dispatch({ type: types.SCAN_RESUMED });
    };
}

export function finishScan({ clientId, clientName, jobId, jobName, created }) {
    return function (dispatch) {
        dispatch({ type: types.SCAN_STATUS_RESET });
        ipcRenderer.send("scan:complete", { clientId, jobId, clientName, jobName, created });
        ipcRenderer.removeAllListeners("mat:found");
    };
}




