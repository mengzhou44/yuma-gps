const path = require("path");
const fs = require("fs");

const { environment } = require('./environment');

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
    scans.push(scan);
    fs.writeFileSync(getFile(), JSON.stringify(scans, null, 4));
}

module.exports = { getScans, addNewScan };