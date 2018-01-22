const electron = require("electron");
const _ = require("lodash");
const path = require("path");
const findProcess = require("find-process");

const { app, BrowserWindow, ipcMain } = electron;

const { getYumaServices } = require("./app/yuma/yuma-services-factory");
const { getReader, checkReader } = require("./app/reader/reader-factory");
const { checkPortal } = require("./app/portal");
const environment = require("./app/environment");
const { getConfig } = require("./app/config");
const Settings = require("./app/settings/settings");

const Clients = require("./app/clients");
const Tags = require("./app/tags");
const Scans = require("./app/scans");
const Tablet = require("./app/tablet");

let mainWindow;
let splashScreen;
 
let reader;
let devices = { gps: false, reader: false, wifi: false };
let checkDevicesTimer;
let yumaServices;


app.on("ready", async () => {

     const list = await  findProcess("name", "YumaServices.exe");

     if (list.length>0) {

         let launchErrorScreen = new BrowserWindow({});
         launchErrorScreen.loadURL(`file://${__dirname}/launch-error.html`);

         launchErrorScreen.on("close", () => {
                app.quit();
        });

         return;
     }

     yumaServices =  getYumaServices();

     splashScreen = new BrowserWindow({});
            splashScreen.loadURL(`file://${__dirname}/splash.html`);

            mainWindow = new BrowserWindow({
                show: false,
                icon: path.join(__dirname, "/assets/images/icon.ico"),
                webPreferences: { backgroundThrottling: false }
            });

            mainWindow.on("close", () => {
                closeApp();
            });


    mainWindow.loadURL(`file://${__dirname}/index.html`);
  

});

app.on("window-all-closed", () => {
    closeApp();
});

app.on("before-quit", () => {
    mainWindow.removeAllListeners("close");
    splashScreen.removeAllListeners("close");
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

ipcMain.on("environment:get", (event) => {
     mainWindow.webContents.send("environment:get", `${environment}`);
});


ipcMain.on("portal:check", (event) => {
    checkPortal().then(available => {
        mainWindow.webContents.send("portal:result", available);
    });
});

function closeApp() {

    if (yumaServices) {
        yumaServices.stop();
    }

    if (reader) {
        reader.stop();
    }
    this.clearInterval(this.checkDevicesTimer);
    this.checkDevicesTimer = null;

    app.quit();
}

async function checkDevices() {
    devices.wifi = yumaServices.checkWifi();

    const gps = await yumaServices.checkGPS();
    devices.gps = gps;

    const reader = await checkReader();
    devices.reader = reader;

    mainWindow.webContents.send("devices:status", devices);
}

ipcMain.on("devices:check", (event) => {
    checkDevices();
});

async function downloadClients() {

     const {success}= await  new Clients().downloadClients();
   
     if (success) {
            mainWindow.webContents.send("sync:progress", { data: { "downloadClients": true } });

     } else {
            mainWindow.webContents.send("sync:progress", { error: "Error occurred when downloading clients." });
    }
}

async function downloadTags() {
        const {success} = await  new Tags().downloadTags();
   
        if (success) {
            mainWindow.webContents.send("sync:progress", { data: { "downloadTags": true } });
        } else {
            mainWindow.webContents.send("sync:progress", { error: "Error occurred when downloading tags." });
        }
}

ipcMain.on("sync", async (event) => {
   
     const {success, error }  =await new Scans().uploadScans(); 
 
    new Scans().clearScans();
    if (success) {
            mainWindow.webContents.send("sync:progress", { data: { "uploadScans": true } });
            await  downloadClients();
            await  downloadTags();
    } else {
         mainWindow.webContents.send("sync:progress", { error: `Error ${error}` });
    }
})


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


ipcMain.on("scan:complete", async (event, scan) => {
    reader.stop();
    scan.mats = reader.getData();
    const scans = new Scans();
    await scans.addNewScan(scan);
    reader.clearData();
    checkDevicesTimer = null;
});

