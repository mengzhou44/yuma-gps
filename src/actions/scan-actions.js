
import { ipcRenderer } from "electron";
import moment from "moment";
import * as types from "./types";


export function getClients() {
    return function (dispatch) {
        ipcRenderer.send("clients:get");
        ipcRenderer.on("clients:result", (event, data) => {
            dispatch({ type: types.CLIENTS_FETCHED, payload: data });
        });
    };
}

export function selectClientId(clientId) {
    return { type: types.CLIENT_ID_SELECTED, payload: clientId };
}

export function selectJobId(jobId) {
    return { type: types.JOB_ID_SELECTED, payload: jobId };
}

export function startScan(mats) {
    return function (dispatch) {
        ipcRenderer.send("scan:start");

        dispatch({ type: types.SCAN_STARTED, payload: Math.floor(Date.now()) });
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
        dispatch({ type: types.SCAN_STARTED });

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


