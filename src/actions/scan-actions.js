
import { ipcRenderer } from 'electron';
import * as types from './types';

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

export function startScan() {
    return function (dispatch) {
        dispatch({ type: types.SCAN_STARTED });
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


