const environment = require("./environment");
const Settings = require("./settings/settings");


function getConfig() {

    const settings = new Settings();

    const { portal } = settings.fetch();

    if (environment === "production") {

        return {
            portalUrl: portal.url,
            useStub: false
        };
    }

    return {
        portalUrl: portal.url,
        useStub: true
    };

}

module.exports = { getConfig }