const path = require("path");
const fs = require("fs");

const { environment } = require('./environment');

function getClients() {
    let clientsFile = path.join(__dirname, "data/clients.json");

    if (environment === "production") {
        clientsFile = path.join(process.resourcesPath, "clients.json");
    }

    var text = fs.readFileSync(clientsFile);
    return JSON.parse(text);
}


module.exports = { getClients };