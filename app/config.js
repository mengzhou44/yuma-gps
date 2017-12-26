const environment = require("./environment");


function getConfig() {
    if (environment === "production") {
        return {
            portalUrl: "http://smartmat.ca/api"
        };
    }

    return {
        portalUrl: "http://localhost:3000"
    }
}

module.exports = { getConfig }