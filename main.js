const electron = require('electron');
const _ = require('lodash');
const path = require("path");
const { app, BrowserWindow, ipcMain } = electron;

const { getYumaServices } = require('./app/yuma/yuma-services-factory');
const { getReader } = require('./app/reader/reader-factory');
const { getClients } = require('./app/clients');
const { addNewScan } = require('./app/scans');
const Settings = require('./app/settings/settings');

let mainWindow;
let splashScreen;
let reader;
let yumaServices = getYumaServices();

app.on('close', () => {
    yumaServices.stop();
    if (reader) {
        reader.stop();
    }
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
    reader = getReader(mainWindow, yumaServices);
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
    const promise1 = yumaServices.checkGPS();
    const promise2 = reader.check();
    Promise.all([promise1, promise2]).then(values => {
        devices.gps = values[0];
        devices.reader = values[1];
        devices.wifi = yumaServices.checkWifi();
        mainWindow.webContents.send('devices:status', devices);
    });
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

ipcMain.on('clients:get', (event) => {
    mainWindow.webContents.send('clients:result', getClients());
});


ipcMain.on('scan:start', (event) => {
    reader.start();
});

ipcMain.on('scan:abort', (event) => {
    reader.clearData();
});

ipcMain.on('scan:complete', (event, scan) => {
    scan.tags = reader.getData();
    addNewScan(scan);
    reader.clearData();
});

ipcMain.on('scan:stop', (event) => {
    reader.stop();
});


