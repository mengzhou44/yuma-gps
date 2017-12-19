
import { ipcRenderer } from 'electron';
import * as types from './types';


export function fetchSettings() {
    return function (dispatch) {
        ipcRenderer.send("settings:get");
        ipcRenderer.on("settings:result", (event, settings) => {
            dispatch({ type: types.SETTINGS_FETCHED, payload: settings });
        });
    };
}

export function saveSettings(settings, callback) {
    return function (dispatch) {
        ipcRenderer.send("settings:save", settings);
        ipcRenderer.on("settings:saved", (event, settings) => {
            dispatch({ type: types.SETTINGS_FETCHED, payload: settings });
            callback();
        });
    };
}