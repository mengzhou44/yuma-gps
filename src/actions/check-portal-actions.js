import { ipcRenderer } from 'electron';
import * as types from './types';


export function resetCheckPortalStatus() {
    return ({ type: types.DEVICES_STATUS_RESET });
}

export function checkPortal() {
    return function (dispatch) {
        ipcRenderer.send("portal:check");
        ipcRenderer.on("portal:result", (event, result) => {
            dispatch({ type: types.PORTAL_STATUS_FETCHED, payload: result });
        });
    };
}
