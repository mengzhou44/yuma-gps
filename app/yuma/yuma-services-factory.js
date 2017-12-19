const YumaServicesStub = require('./yuma-services-stub');
const YumaServices = require('./yuma-services');

const { environment } = require('../environment');

function getYumaServices() {
    if (environment === "dev") {
        return new YumaServicesStub();
    }
    return new YumaServices();
}

module.exports = { getYumaServices }