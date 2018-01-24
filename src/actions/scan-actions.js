
import { ipcRenderer } from "electron";
import moment from "moment";
import * as types from "./types";


export function startScan({ clients, clientId, jobId, jobType }) {
    return function (dispatch) {
        ipcRenderer.send("scan:start", jobType);
        const payload = {
            clients,
            clientId,
            jobId,
            jobType,
            created: Math.floor(Date.now())
        };
        dispatch({ type: types.SCAN_STARTED, payload });
        ipcRenderer.on("mat:found", (event, progress) => {
            if (progress.found > 0) {
                dispatch({ type: types.MAT_FOUND, payload: progress });
            }

        });
    };
}


export function finishScan({ clientId, clientName, jobId, jobName, created }) {
    return function (dispatch) {
        dispatch({ type: types.SCAN_FINISHING });
        ipcRenderer.send("scan:complete", { clientId, jobId, clientName, jobName, created });
        ipcRenderer.once("scan:complete", (event) => {
            dispatch({ type: types.SCAN_STATUS_RESET });
            ipcRenderer.removeAllListeners("mat:found");
        });

    };
}







