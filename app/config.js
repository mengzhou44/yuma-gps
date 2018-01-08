const environment = require("./environment");


function getConfig() {
    if (environment === "production") {
        return {
            portalUrl: "http://empirelinux.com:9000",
            useStub: false
        };
    }

    return {
        // portalUrl: "http://localhost:5000",
        //portalUrl: "http://empirelinux.com:9000",
        portalUrl: "https://services.lunchpad123.com",
        useStub: false
    }
}

module.exports = { getConfig }