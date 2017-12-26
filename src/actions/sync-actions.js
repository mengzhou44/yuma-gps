
import { ipcRenderer } from 'electron';
import * as types from './types';

export function getScans() {
    return function (dispatch) {
        ipcRenderer.send("scans:get");
        ipcRenderer.on("scans:result", (event, scans) => {
            dispatch({ type: types.SYNC_SCANS_FETCHED, payload: scans });
        });
    };
}
