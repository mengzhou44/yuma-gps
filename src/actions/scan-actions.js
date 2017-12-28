
import { ipcRenderer } from "electron";
import moment from "moment";
import * as types from "./types";


export function startScan({ clientId, jobId }) {
    return function (dispatch) {
        ipcRenderer.send("scan:start");

        const payload = {
            clientId,
            jobId,
            created: Math.floor(Date.now())
        };
        dispatch({ type: types.SCAN_STARTED, payload });
        let mats = 0;
        ipcRenderer.on("mat:found", (event) => {
            mats++;
            dispatch({ type: types.MAT_FOUND, payload: mats });
        });
    };
}

export function stopScan(mats) {
    return function (dispatch) {
        ipcRenderer.send("scan:stop");
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
        ipcRenderer.send("scan:start");
        dispatch({ type: types.SCAN_RESUMED });

    };
}

export function abortScan() {
    return function (dispatch) {
        dispatch({ type: types.SCAN_STATUS_RESET });
        ipcRenderer.send("scan:abort");
        ipcRenderer.removeAllListeners("mat:found");
    };
}

export function finishScan({ clientId, jobId, created }) {
    return function (dispatch) {
        dispatch({ type: types.SCAN_STATUS_RESET });
        ipcRenderer.send("scan:complete", { clientId, jobId, created });
        ipcRenderer.removeAllListeners("mat:found");
    };
}

export function getGPSLocation() {
    return function (dispatch) {
        ipcRenderer.send("gps-data:get");
        ipcRenderer.on("gps-data:result", (event, location) => {
            dispatch({ type: types.LOCATION_FETCHED, payload: location });
        });
    };
}


