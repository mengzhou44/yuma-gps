const path = require("path");
const fs = require("fs");
const axios = require("axios");

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

    async addNewScan(scan) {
        let tablet = new Tablet();
        const macAddress = await tablet.getMacAddress();
        scan.deviceId = macAddress;
        let scans = this.getScans();
        scans.push(scan);
        fs.writeFileSync(this.scansFile, JSON.stringify(scans, null, 4));
    }

    async  uploadScans() {

        const { portalUrl } = getConfig();
        try {
            const scans = this.getScans();
            if (scans.length === 0) {
                return { success: true };
            }
            const res = await axios.post(`${portalUrl}/scans`, JSON.stringify(scans));
            if (res.data.success) {
                this.clearScans();
                return { success: true };
            }
            return { success: false };
        } catch (ex) {
            return { success: false };
        }
    }

    clearScans() {
        try {
            fs.writeFileSync(this.scansFile, JSON.stringify([], null, 4));
        } catch (ex) {
            console.log("Error occured whrn clearing scans...", ex);
        }
    }
}

module.exports = Scans;