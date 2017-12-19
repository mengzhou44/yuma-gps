const path = require("path");
const axios = require("axios");
const wifi = require('wifi-control');
const { spawn } = require('child_process');

wifi.init({});


const { environment } = require('./environment');

let cmd = null;

startYumaServices();


function startYumaServices() {
      if (environment === "dev") {
            return;
      }

      let commandPath;

      if (environment === "production") {
            commandPath = path.join(process.resourcesPath, "yuma-lib");

      } else {
            commandPath = __dirname + "\\yuma-lib";
      }
      cmd = spawn('YumaServices.exe', { cwd: commandPath });
}

function getYumaGPSUrl() {

      if (environment === "test") {
            return 'http://localhost:3000/api/test/getLocation';
      }
      return 'http://localhost:3000/api/yuma/getLocation';
}

/* exposed functions */

function stopYumaServices() {
      if (environment !== "dev") {
            cmd.unref();
      }
}

function checkWifi() {
      if (environment === "dev") {
            return false;
      }
      const { connection } = wifi.getIfaceState();
      return connection;
};


async function checkGPS() {
      if (environment === "dev") {
            return true;
      }

      try {
            const res = await axios.get("http://localhost:3000/gps");
            return new Promise((resolve) => {
                  resolve(true);
            })
      } catch (e) {
            return new Promise((resolve) => {
                  resolve(false);
            })
      }
};


async function getGPSData() {

      if (environment === "dev") {
            return {
                  latitude: 45.573,
                  longitude: -104.323
            };
      }

      try {
            const res = await axios.get(getYumaGPSUrl());
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

};


module.exports = { stopYumaServices, checkWifi, checkGPS, getGPSData }

