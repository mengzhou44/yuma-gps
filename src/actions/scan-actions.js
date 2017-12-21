
import { ipcRenderer } from 'electron';
import * as types from './types';

export function getJobTypes() {
    return function (dispatch) {
        ipcRenderer.send("job-types:get");
        ipcRenderer.on("job-types:result", (event, data) => {
            dispatch({ type: types.JOB_TYPES_FETCHED, payload: data });
        });
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


