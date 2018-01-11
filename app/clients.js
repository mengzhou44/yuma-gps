const path = require("path");
const fs = require("fs");
const axios = require("axios");
const _ = require("lodash");
const { getConfig } = require("./config");

const { environment } = require("./environment");
const Settings = require("./settings/settings");

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

    addNewClient(clientName) {
        const clients = this.getClients();
        const clientId = 0 - (clients.length + 2);
        const client = {
            clientName,
            clientId,
            jobs: []
        };
        clients.push(client);
        fs.writeFileSync(this.clientsFile, JSON.stringify(clients, null, 4));
        return clientId;
    }

    addNewJob(clientId, jobName) {
        const clients = this.getClients();
        let client = _.find(clients, (client) => client.clientId === clientId);

        const jobId = 0 - (client.jobs.length + 2);
        const job = {
            id: jobId,
            name: jobName
        };
        client.jobs.push(job);
        fs.writeFileSync(this.clientsFile, JSON.stringify(clients, null, 4));
        return jobId;
    }

    convertToLowerCamelCase(clients) {
        return _.map(clients, (client) => {
            client.clientName = client.clientname;
            client.clientId = client.clientid;
            delete client.clientname;
            delete client.clientid;
            return client;
        })
    }

    async downloadClients() {
        const { portalUrl } = getConfig();
        const clientsUrl = `${portalUrl}/clients`;
        const token = new Settings().getToken();
        const config = {
            headers: { Authorization: `bearer ${token}` }
        };

        try {
            const res = await axios.get(clientsUrl, config);
            const clients = this.convertToLowerCamelCase(res.data);
            fs.writeFileSync(this.clientsFile, JSON.stringify(clients, null, 4));
            return { success: true };
        } catch (error) {
            console.log("error", error);
            return { success: false };
        }

    }
}

module.exports = Clients;