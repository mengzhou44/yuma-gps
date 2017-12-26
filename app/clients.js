const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { getConfig } = require("./config");

const { environment } = require('./environment');

function getClientsFile() {
    let clientsFile = path.join(__dirname, "data/clients.json");

    if (environment === "production") {
        clientsFile = path.join(process.resourcesPath, "clients.json");
    }
    return clientsFile;

}

function getClients() {
    var text = fs.readFileSync(getClientsFile());
    return JSON.parse(text);
}

async function download() {
    const { portalUrl } = getConfig();
    const clientsUrl = `${portalUrl}/clients`;
    const res = await axios.get(clientsUrl);

    fs.writeFileSync(getClientsFile(), JSON.stringify(res.data, null, 4));
}


module.exports = { getClients, download };