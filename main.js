const electron = require("electron");
const _ = require("lodash");
const path = require("path");

const { app, BrowserWindow, ipcMain } = electron;

const { getYumaServices } = require("./app/yuma/yuma-services-factory");
const { getReader, getBatchReader, checkReader } = require("./app/reader/reader-factory");
const { checkPortal } = require("./app/portal");
const Settings = require("./app/settings/settings");

const Clients = require("./app/clients");
const Scans = require("./app/scans");
const Tablet = require("./app/tablet");

let mainWindow;
let splashScreen;
let reader;
let yumaServices = getYumaServices();

app.on("close", () => {
    yumaServices.stop();
    if (reader) {
        reader.stop();
    }
});


app.on("ready", () => {
    // splashScreen = new BrowserWindow({});
    // splashScreen.loadURL(`file://${__dirname}/splash.html`);

    mainWindow = new BrowserWindow({
        //  show: false,
        icon: path.join(__dirname, "/assets/images/icon.ico"),
        webPreferences: { backgroundThrottling: false }
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);
});


ipcMain.on("system:initialized", (event) => {
    //  splashScreen.hide();
    //  mainWindow.show();
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
    new Tablet().getMacAddress((macAddress) => {
        mainWindow.webContents.send("tablet:mac", macAddress);
    }
    );
});


ipcMain.on("portal:check", (event) => {
    checkPortal().then(available => {
        mainWindow.webContents.send("portal:result", available);
    });
});

ipcMain.on("devices:check", (event) => {
    const devices = {};
    const promise1 = yumaServices.checkGPS();
    const promise2 = checkReader();
    Promise.all([promise1, promise2]).then(values => {
        devices.gps = values[0];
        devices.reader = values[1];
        devices.wifi = yumaServices.checkWifi();
        mainWindow.webContents.send("devices:status", devices);
    });
});

ipcMain.on("clients:get", (event) => {
    mainWindow.webContents.send("clients:result", new Clients().getClients());
});

ipcMain.on("clients:download", (event) => {
    const clients = new Clients();
    clients.downloadClients().then((error) => {
        mainWindow.webContents.send("clients:download", error);
    });
});

ipcMain.on("clients:new-client", (event, clientName) => {
    const clientId = new Clients().addNewClient(clientName);
    mainWindow.webContents.send("clients:new-client", clientId);
});

ipcMain.on("clients:new-job", (event, { clientId, jobName }) => {
    const jobId = new Clients().addNewJob(clientId, jobName);
    mainWindow.webContents.send("clients:new-job", jobId);
});

ipcMain.on("scans:get", (event) => {
    mainWindow.webContents.send("scans:result", new Scans().getScans());
});

ipcMain.on("scans:upload", (event) => {
    new Scans().uploadScans().then((success) => {
        if (success) {
            mainWindow.webContents.send("scans:upload");
            scans.clearScans();
        } else {
            mainWindow.webContents.send("scans:upload", "Error occurred while uploading");
        }
    });
});

ipcMain.on("scan:start", (event) => {
    if (reader) {
        reader.stop();
    }
    reader = getReader(mainWindow, yumaServices);
    reader.start();
});

ipcMain.on("contamination-scan:start", (event) => {
    if (reader) {
        reader.stop();
    }
    const { contamination } = new Settings().fetch();
    const batchSize = contamination.batchSize;

    reader = getBatchReader(mainWindow, yumaServices, batchSize);
    reader.start();
});


ipcMain.on("batch:process", (event, data) => {
    const result = reder.processBatch(data);
    mainWindow.webContents.send("batch:process", result);
});

ipcMain.on("scan:stop", (event) => {
    reader.stop();
});

ipcMain.on("scan:resume", (event) => {
    reader.start();
});

ipcMain.on("scan:abort", (event) => {
    reader.clearData();
});

ipcMain.on("scan:complete", (event, scan) => {
    scan.tags = reader.getData();
    const scans = new Scans();
    scans.addNewScan(scan);
    reader.clearData();
});

