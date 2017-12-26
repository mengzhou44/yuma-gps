const path = require("path");
const fs = require("fs");
const axios = require("axios");
const _ = require("lodash");
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

function getClient(clientId) {
    const clients = getClients();
    return _.find(clients, (client) => client.clientId === clientId);
}

function findClientName(clientId) {
    const client = getClient(clientId);
    return client.clientName;
}

function findJobName(clientId, jobId) {
    const client = getClient(clientId);
    const job = _.find(client.jobs, (job) => job.id === jobId);
    return job.name;
}


async function downloadClients() {
    const { portalUrl } = getConfig();
    const clientsUrl = `${portalUrl}/clients`;
    const res = await axios.get(clientsUrl);

    fs.writeFileSync(getClientsFile(), JSON.stringify(res.data, null, 4));
}


module.exports = { getClients, downloadClients, findClientName, findJobName };