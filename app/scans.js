const path = require("path");
const fs = require("fs");
const axios = require("axios");

const { environment } = require("./environment");
const { getConfig } = require("./config");
const { findClientName, findJobName } = require("./clients");


function getFile() {
    let scansFile = path.join(__dirname, "data/scans.json");

    if (environment === "production") {
        scansFile = path.join(process.resourcesPath, "scans.json");
    }

    return scansFile;
}

function getScans() {
    var text = fs.readFileSync(getFile(), "utf8");
    if (text === "") {
        return [];
    }
    return JSON.parse(text);
}

function addNewScan(scan) {
    let scans = getScans();
    scan.clientName = findClientName(scan.clientId);
    scan.jobName = findJobName(scan.clientId, scan.jobId);
    scans.push(scan);
    fs.writeFileSync(getFile(), JSON.stringify(scans, null, 4));
}


async function uploadScans() {
    const { portalUrl } = getConfig();
    try {
        const scans = getScans();
        const res = await axios.post(`${portalUrl}/scans`, JSON.stringify(scans));
        if (res.data.success) {
            return true;
        }
        return false;
    } catch (ex) {
        return false;
    }
}


function clearScans() {
    fs.writeFileSync(getFile(), JSON.stringify([], null, 4));
}

module.exports = { getScans, addNewScan, uploadScans, clearScans };