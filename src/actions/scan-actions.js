
import { ipcRenderer } from 'electron';
import * as types from './types';


export function getGPSLocation() {
    return function (dispatch) {
        ipcRenderer.send("location:get");
        ipcRenderer.on("location:result", (event, { location }) => {
            console.log('location: ', location);
              dispatch({ type: types.LOCATION_FETCHED, payload: location });  
        });
    };
}

 