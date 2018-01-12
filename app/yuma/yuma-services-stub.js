const wifi = require('wifi-control');


class YumaServicesStub {

    constructor() {
        wifi.init({});
    }


    stop() {
    }

    checkWifi() {
     
        const {ssid,  connection } = wifi.getIfaceState();

           if (!ssid) {
                  return false;
            }

        if (connection) return true;
        return false;
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

