const path = require("path");
const axios = require("axios");
const wifi = require('wifi-control');
const { spawn } = require('child_process');

const { environment } = require('../environment');


class YumaServices {

      constructor() {
            this.cmd = null;
            wifi.init({});

            if (environment === "dev") {
                  return;
            }

            let commandPath;

            if (environment === "production") {
                  commandPath = path.join(process.resourcesPath, "yuma-lib");

            } else {
                  commandPath = __dirname + "\\yuma-lib";
            }

            this.cmd = spawn('YumaServices.exe', { cwd: commandPath });

      }

      getGPSUrl() {

            if (environment === "test") {
                  return 'http://localhost:3000/api/test/getLocation';
            }
            return 'http://localhost:3000/api/yuma/getLocation';
      }


      stop() {
            cmd.unref();
      }

      checkWifi() {
            const { connection } = wifi.getIfaceState();
            if (connection) return true;
            return false;
      };

      async checkGPS() {
            try {
                  const res = await axios.get(this.getGPSUrl());
                  return new Promise((resolve) => {
                        resolve(true);
                  })
            } catch (e) {

                  return new Promise((resolve) => {
                        resolve(false);
                  })
            }

      }

      async  getGPSData() {
            try {
                  const res = await axios.get(this.getGPSUrl());
                  const temp = res.data.split(",");
                  const latitude = parseFloat(temp[0].trim());
                  const longitude = parseFloat(temp[1].trim());

                  return new Promise(resolve => {
                        return resolve(
                              {
                                    latitude,
                                    longitude
                              }
                        );
                  });
            }
            catch (err) {
                  return new Promise(resolve => {
                        return resolve(
                              {
                                    latitude: 0,
                                    longitude: 0
                              }
                        );
                  });
            }
      }
}

module.exports = YumaServices;


