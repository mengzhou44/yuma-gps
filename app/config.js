const environment = require("./environment");


function getConfig() {
    if (environment === "production") {
        return {
            portalUrl: "http://smartmat.ca/api",
            useStub: false,
            checkKnownTags: true
        };
    }

    return {
        portalUrl: "http://localhost:3000",
        useStub: true,
        checkKnownTags: true
    }
}

module.exports = { getConfig }