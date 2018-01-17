const path = require("path");
const axios = require("axios");
const wifi = require('wifi-control');
const { spawn } = require('child_process');

const { environment } = require('../environment');


class YumaServices {

      constructor() {

            try{
                   wifi.init({});
            } catch(error) {

            }
            
            if (environment === "dev") {
                  return;
            }

            let commandPath;
            this.cmd = null;

            if (environment === "production") {
                  commandPath = path.join(process.resourcesPath, "yuma-lib");

            } else {
                  commandPath = __dirname + "/yuma-lib";
            }
            try{
                 this.cmd = spawn("YumaServices.exe", { cwd: commandPath });
            } catch(err) {
                  console.log("Error to start Yuma Services", err);
            }
      }

      getGPSUrl() {

            if (environment === "test") {
                  return "http://localhost:3000/api/test/getLocation";
            }
            return "http://localhost:3000/api/yuma/getLocation";
      }

      stop() {      
          this.cmd.unref();
      }

      checkWifi() {
            const { ssid, connection } = wifi.getIfaceState();
            if (!ssid) {
                  return false;
            }
            if (ssid.includes("smartmat")===false) {
                  return false;
            }
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


