const electron = require("electron");
const _ = require("lodash");
const path = require("path");

const { app, BrowserWindow, ipcMain } = electron;

const { getYumaServices } = require("./app/yuma/yuma-services-factory");
const { getReader, checkReader } = require("./app/reader/reader-factory");
const { checkPortal } = require("./app/portal");
const Settings = require("./app/settings/settings");

const Clients = require("./app/clients");
const Tags = require("./app/tags");
const Scans = require("./app/scans");
const Tablet = require("./app/tablet");

let mainWindow;
let splashScreen;
let reader;
let devices ={ gps: false, reader: false, wifi: false };
let checkDevicesTimer;
let yumaServices = getYumaServices();

 


app.on("ready", () => {
    splashScreen = new BrowserWindow({});
    splashScreen.loadURL(`file://${__dirname}/splash.html`);

    mainWindow = new BrowserWindow({
        show: false,
        icon: path.join(__dirname, "/assets/images/icon.ico"),
        webPreferences: { backgroundThrottling: false }
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

});

app.on("window-all-closed",  ()=> {
  closeApp();
});

app.on("before-quit", () => {
    mainWindow.close();
    splashScreen.close();
});


ipcMain.on("system:initialized", (event) => {
    splashScreen.hide();
    mainWindow.show();
});


ipcMain.on("settings:get", (event) => {
    const settings = new Settings();
    const result = settings.fetch();
    mainWindow.webContents.send("settings:result", result);

});

ipcMain.on("settings:save", (event, data) => {
    const settings = new Settings();
    settings.save(data);
    mainWindow.webContents.send("settings:saved", data);

});

ipcMain.on("tablet:register", (event, macAddress) => {
    new Tablet().register().then(result => {
        mainWindow.webContents.send("tablet:register", result);
    });
});

ipcMain.on("tablet:mac", (event) => {
    new Tablet().getMacAddress().then(macAddress => {
        mainWindow.webContents.send("tablet:mac", macAddress);
    });
});


ipcMain.on("portal:check", (event) => {
    checkPortal().then(available => {
        mainWindow.webContents.send("portal:result", available);
    });
});

function closeApp() {
    yumaServices.stop();
    if (reader) {
        reader.stop();
    }
    this.clearInterval(this.checkDevicesTimer);
    this.checkDevicesTimer= null;

    app.quit();
}

function checkDevices() { 
   devices.wifi = yumaServices.checkWifi();
   yumaServices.checkGPS().then(value=> {
        devices.gps = value;
        mainWindow.webContents.send("devices:status", devices);
    });
 
    checkReader().then(value=> {
        devices.reader = value;
        mainWindow.webContents.send("devices:status", devices);
    });

}

ipcMain.on("devices:check", (event) => {
    checkDevices();
});

function downloadClients() {

    new Clients().downloadClients().then(({ success }) => {
        if (success) {
            mainWindow.webContents.send("sync:progress", { data: { "downloadClients": true } });

        } else {
            mainWindow.webContents.send("sync:progress", { error: "Error occurred when downloading clients." });
        }
    });

}

function downloadTags() {
    new Tags().downloadTags().then(({ success }) => {
        if (success) {
            mainWindow.webContents.send("sync:progress", { data: { "downloadTags": true } });
        } else {
            mainWindow.webContents.send("sync:progress", { error: "Error occurred when downloading tags." });
        }
    });
}

ipcMain.on("sync", (event) => {

    new Scans().uploadScans().then(({ success }) => {
        if (success) {
            mainWindow.webContents.send("sync:progress", { data: { "uploadScans": true } });
            downloadClients();
            downloadTags();
        } else {
            mainWindow.webContents.send("sync:progress", { error: "Error occurred when uploading scans." });
        }
    });
});


ipcMain.on("clients:get", (event) => {
    mainWindow.webContents.send("clients:result", new Clients().getClients());
});


ipcMain.on("clients:new-client", (event, clientName) => {
    const clientId = new Clients().addNewClient(clientName);
    mainWindow.webContents.send("clients:new-client", clientId);
});

ipcMain.on("clients:new-job", (event, { clientId, jobName }) => {
    const jobId = new Clients().addNewJob(clientId, jobName);
    mainWindow.webContents.send("clients:new-job", jobId);
});


ipcMain.on("scan:start", (event) => {
    if (reader) {
        reader.stop();
    }
    reader = getReader(mainWindow, yumaServices);
    reader.start();

    checkDevicesTimer = setInterval(() => {
        checkDevices();
    }, 10000);
});


ipcMain.on("batch:process", (event, data) => {
    reader.processBatch(data);
});

ipcMain.on("scan:stop", (event) => {
    reader.stop();
});

ipcMain.on("scan:resume", (event) => {
    reader.start();
});

ipcMain.on("scan:complete", (event, scan) => {
    scan.mats = reader.getData();
    const scans = new Scans();
    scans.addNewScan(scan);
    reader.clearData();
    checkDevicesTimer = null;
});

