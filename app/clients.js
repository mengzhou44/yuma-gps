const path = require("path");
const fs = require("fs");
const axios = require("axios");
const _ = require("lodash");
const { getConfig } = require("./config");

const { environment } = require('./environment');

class Clients {

    constructor() {
        this.clientsFile = path.join(__dirname, "data/clients.json");

        if (environment === "production") {
            this.clientsFile = path.join(process.resourcesPath, "clients.json");
        }
    }

    getClients() {
        var text = fs.readFileSync(this.clientsFile);
        return JSON.parse(text);
    }

    getClient(clientId) {
        const clients = this.getClients();
        return _.find(clients, (client) => client.clientId === clientId);
    }

    findClientName(clientId) {
        const client = this.getClient(clientId);
        return client.clientName;
    }

    findJobName(clientId, jobId) {
        const client = this.getClient(clientId);
        const job = _.find(client.jobs, (job) => job.id === jobId);
        return job.name;
    }

    async downloadClients() {
        const { portalUrl } = getConfig();
        const clientsUrl = `${portalUrl}/clients`;
        const res = await axios.get(clientsUrl);

        fs.writeFileSync(this.clientsFile, JSON.stringify(res.data, null, 4));
    }
}

module.exports = Clients;