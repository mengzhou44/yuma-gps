
import { ipcRenderer } from "electron";
import { reset } from "redux-form";
import * as types from "./types";


export function fetchSettings() {
    return function (dispatch) {
        ipcRenderer.send("settings:get");
        ipcRenderer.once("settings:result", (event, settings) => {
            dispatch({ type: types.SETTINGS_FETCHED, payload: settings });
            dispatch(reset("reader-form"));
        });
    };
}

export function saveSettings(settings, callback) {
    return function (dispatch) {
        ipcRenderer.send("settings:save", settings);
        ipcRenderer.once("settings:saved", (event, settings) => {
            dispatch({ type: types.SETTINGS_FETCHED, payload: settings });
            callback();
        });
    };
}