const electron = require('electron');
const _ = require('lodash');
const path = require("path");
const { app, BrowserWindow, ipcMain } = electron;

const { getYumaServices } = require('./app/yuma/yuma-services-factory');
const Settings = require('./app/settings/settings');

let tags = [];

let mainWindow;
let splashScreen;
let yumaServices = getYumaServices();

app.on('close', () => {
    yumaServices.stop();
});


app.on('ready', () => {
    // splashScreen = new BrowserWindow({});
    // splashScreen.loadURL(`file://${__dirname}/splash.html`);

    mainWindow = new BrowserWindow({
        //  show: false,
        icon: path.join(__dirname, "/assets/images/icon.ico"),
        webPreferences: { backgroundThrottling: false }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});


ipcMain.on('system:initialized', (event) => {
    //  splashScreen.hide();
    //  mainWindow.show();
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
        devices.reader = true;
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



