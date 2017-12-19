const electron = require('electron');
const _ = require('lodash');
const { app, BrowserWindow, ipcMain } = electron;

const { getYumaServices } = require('./app/yuma-services-factory');

let tags = [];

let mainWindow;
let yumaServices = getYumaServices();


app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});


app.on('close', () => {
    yumaServices.stop();
});

ipcMain.on('gps-data:get', (event) => {
    yumaServices.getGPSData().then(data => {
        mainWindow.webContents.send('gps-data:result', data);
    });
});


ipcMain.on('devices:check', (event) => {
    const devices = {};

    yumaServices.checkGPS().then(result => {
        devices.gps = result;
        devices.wifi = yumaServices.checkWifi();
        mainWindow.webContents.send('devices:status', devices);
    })

});


