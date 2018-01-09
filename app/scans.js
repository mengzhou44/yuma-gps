const path = require("path");
const fs = require("fs");
const axios = require("axios");
const _ = require("lodash");

const { environment } = require("./environment");
const { getConfig } = require("./config");
const Clients = require("./clients");
const Tablet = require("./tablet");

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
                tags: [],
                time: mat.tempStamp,
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
        let tablet = new Tablet();
        const macAddress = await tablet.getMacAddress();
        scan.deviceId = macAddress;
        const serverScan = this.convertScanToServerFormat(scan);
        let scans = this.getScans();
        scans.push(serverScan);
        fs.writeFileSync(this.scansFile, JSON.stringify(scans, null, 4));
    }

    async  uploadScans() {

        const { portalUrl } = getConfig();
        try {
            const scans = this.getScans();
            if (scans.length === 0) {
                return { success: true };
            }
            const res = await axios.post(`${portalUrl}/field-data`, JSON.stringify(scans));

            if (res.data.success) {
                this.clearScans();
                return { success: true };
            }
            return { success: false };
        } catch (ex) {
            console.log("upload scann error", ex);
            return { success: false };
        }
    }

    clearScans() {
        try {
            fs.writeFileSync(this.scansFile, JSON.stringify([], null, 4));
        } catch (ex) {
            console.log("Error occured when clearing scans...", ex);
        }
    }
}

module.exports = Scans;
