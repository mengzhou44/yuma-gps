const wifi = require('wifi-control');

class YumaServicesStub {

    stop() {
    }

    checkWifi() {
        const { connection } = wifi.getIfaceState();
        return connection;
    };

    async checkGPS() {
        return true;
    }

    async  getGPSData() {
        return {
            latitude: 45.573,
            longitude: -104.323
        };
    }
}

module.exports = YumaServicesStub;

