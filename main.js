const electron = require('electron');
const _ = require('lodash');
const { app, BrowserWindow, ipcMain } = electron;

const {getGPSLocation, stopYumaServices } = require('./app/gps-reader');

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


