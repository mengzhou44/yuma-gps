const electron = require('electron');
const _ = require('lodash');
const { app, BrowserWindow, ipcMain } = electron;

const {getGPSLocation } = require('./app/gps-reader');

let tags = [];

let mainWindow;
let tcpClient;
let gpsReader;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(`file://${__dirname}/index.html`);
});
 

ipcMain.on('location:get', (event) => {
   getGPSLocation((location)=> {
       mainWindow.webContents.send('location:result', {location})
    });
  
});


