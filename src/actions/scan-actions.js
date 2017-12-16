
import { ipcRenderer } from 'electron';
import * as types from './types';


export function getGPSLocation() {
    return function (dispatch) {
        ipcRenderer.send("location:get");
        ipcRenderer.on("location:result", (event, { location }) => {
              dispatch({ type: types.LOCATION_FETCHED, payload: location });  
        });
    };
}

 
export function checkWifi() {
    return function (dispatch) {
        ipcRenderer.send("wifi-status:get");
        ipcRenderer.on("wifi-status:result", (event, { available }) => {    
              console.log("Available", available);
              dispatch({ type: types.WIFI_STATUS_FETCHED, payload: available });  
        });
    };
}
