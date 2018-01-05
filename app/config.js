const environment = require("./environment");


function getConfig() {
    if (environment === "production") {
        return {
            portalUrl: "http://smartmat.ca/api",
            useStub: false
        };
    }

    return {
        portalUrl: "http://localhost:3000",
        useStub: true
    }
}

module.exports = { getConfig }