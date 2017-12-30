
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
            created: Math.floor(Date.now()),
            contaminationJob: false
        };
        dispatch({ type: types.SCAN_STARTED, payload });
        ipcRenderer.on("mat:found", (event, progress) => {
            dispatch({ type: types.MAT_FOUND, payload: progress });
        });
    };
}

export function startContaminationScan({ clients, clientId, jobId }) {
    return function (dispatch) {
        ipcRenderer.send("contamination-scan:start");
        const payload = {
            clients,
            clientId,
            jobId,
            created: Math.floor(Date.now()),
            contaminationJob: false
        };
        dispatch({ type: types.SCAN_STARTED, payload });
        ipcRenderer.on("mat:found", (event, progress) => {
            console.log("mat:found", JSON.stringify(progress, null, 4));
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


