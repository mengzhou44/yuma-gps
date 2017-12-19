const electron = require('electron');
const _ = require('lodash');
const { app, BrowserWindow, ipcMain } = electron;

const { getYumaServices } = require('./app/yuma/yuma-services-factory');
const Settings = require('./app/settings/settings');

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


ipcMain.on('settings:get', (event) => {
    const settings = new Settings();
    mainWindow.webContents.send('settings:result', settings.fetch());

});


ipcMain.on('settings:save', (event, data) => {
    const settings = new Settings();
    settings.save(data);
    mainWindow.webContents.send('settings:saved', data);

});


