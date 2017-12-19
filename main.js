const electron = require('electron');
const _ = require('lodash');
const { app, BrowserWindow, ipcMain } = electron;

const { getGPSData, checkWifi, checkGPS, stopYumaServices } = require('./app/yuma-services');

let tags = [];

let mainWindow;
let tcpClient;
let gpsReader;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});


app.on('close', () => {
    stopYumaServices();
});

ipcMain.on('gps-data:get', (event) => {
    getGPSData().then(data => {
        mainWindow.webContents.send('gps-data:result', data);
    });
});


ipcMain.on('devices:check', (event) => {
    const devices = {};

    checkGPS().then(result => {
        devices.gps = result;
        devices.wifi = checkWifi();
        mainWindow.webContents.send('devices:status', devices);
    })

});


