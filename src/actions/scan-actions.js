
import { ipcRenderer } from 'electron';
import * as types from './types';

export function getGPSLocation() {
    return function (dispatch) {
        ipcRenderer.send("gps-data:get");
        ipcRenderer.on("gps-data:result", (event, location) => {
            dispatch({ type: types.LOCATION_FETCHED, payload: location });
        });
    };
}



