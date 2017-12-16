const electron = require('electron');
const _ = require('lodash');
const { app, BrowserWindow, ipcMain } = electron;

const {getGPSLocation, checkWifi, stopYumaServices } = require('./app/yuma-services');

let tags = [];

let mainWindow;
let tcpClient;
let gpsReader;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(`file://${__dirname}/index.html`);
});


 app.on('close', ()=> {
        stopYumaServices();
 });

ipcMain.on('location:get', (event) => {
   getGPSLocation((location)=> {
       mainWindow.webContents.send('location:result', {location})
    });
  
});

ipcMain.on('wifi-status:get', (event) => {
   checkWifi((available)=> {
       mainWindow.webContents.send('wifi-status:result', {available})
    });
  
});


