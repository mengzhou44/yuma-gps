const path = require("path");
const fs = require("fs");
const axios = require("axios");
const _ = require("lodash");

const { environment } = require("./environment");
const { getConfig } = require("./config");
const Clients = require("./clients");
const Tablet = require("./tablet");

const Settings = require("./settings/settings");

class Scans {

    constructor() {

        this.scansFile = path.join(__dirname, "data/scans.json");
        if (environment === "production") {
            this.scansFile = path.join(process.resourcesPath, "scans.json");
        }
    }

    getScans() {
        var text = fs.readFileSync(this.scansFile, "utf8");
        if (text === "") {
            return [];
        }
        return JSON.parse(text);
    }

    convertMatsToServerFormat(mats) {
        return _.map(mats, (mat) => {
            const converted = {
                id: mat.matId,
                gps: mat.gps,
                time: mat.timeStamp,
                contaminated: mat.contaminated
            };
            return converted;
        });
    }

    convertScanToServerFormat(scan) {

        const gps = scan.mats.length > 1 ? scan.mats[0].gps : [];

        const converted = {
            client: scan.clientName,
            clientid: scan.clientId,
            job: scan.jobName,
            jobid: scan.jobId,
            gps,
            time: scan.created,
            deviceid: scan.deviceId,
            mats: this.convertMatsToServerFormat(scan.mats),
        }

        return converted;
    }


    async addNewScan(scan) {

        if (scan.mats.length === 0) {
            return;
        }

        let tablet = new Tablet();
        const macAddress = await tablet.getMacAddress();
        scan.deviceId = macAddress;
        const serverScan = this.convertScanToServerFormat(scan);
        let scans = this.getScans();
        scans.push(serverScan);
        fs.writeFileSync(this.scansFile, JSON.stringify(scans, null, 4));
    }

    backupUploadedScan(scan) {
        const homeDir = require('os').homedir();
        const fileName = path.join(homeDir, "smartmat",
            `${scan.time} - ${scan.clientname} - ${scan.jobname}.json`);

        fs.writeFileSync(fileName, JSON.stringify(scan, null, 4));
    }

    async  uploadScans() {

        const { portalUrl } = getConfig();
        const token = new Settings().getToken();

        try {
            const scans = this.getScans();

            if (scans.length === 0) {
                return { success: true };
            }
            const config = {
                headers: { Authorization: `bearer ${token}` }
            };
            _.map(scans, async (scan) => {
                // const res = await axios.post(`${portalUrl}/field-data`, JSON.stringify(scan), config);
                this.backupUploadedScan(scan);
            });

            return { success: true };

        } catch (ex) {
            return { success: false };
        }
    }

    clearScans() {
        try {
            fs.writeFileSync(this.scansFile, JSON.stringify([], null, 4));
        } catch (ex) {
            console.log("Error occurred when clearing scans...", ex);
        }
    }
}

module.exports = Scans;
