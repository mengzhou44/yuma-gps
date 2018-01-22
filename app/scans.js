const path = require("path");
const fs = require("fs-extra");
const axios = require("axios");
const _ = require("lodash");

const  environment = require("./environment");
const { getConfig } = require("./config");
const Clients = require("./clients");


const Settings = require("./settings/settings");

class Scans {

    constructor() {

        this.scansFile = path.join(__dirname, "data/scans.json");
        if (environment === "production") {
            this.scansFile = path.join(process.resourcesPath, "scans.json");
        }
    }

    getScans() {
        var text = fs.readFileSync(this.scansFile, "utf8");
        if (text === "") {
            return [];
        }
        return JSON.parse(text);
    }

    convertMatsToServerFormat(mats) {
        return _.map(mats, (mat) => {
            const converted = {
                id: mat.matId,
                gps: mat.gps,
                time: mat.timeStamp,
                contaminated: mat.contaminated
            };
            return converted;
        });
    }

    convertScanToServerFormat(scan) {

        const gps = scan.mats.length >  0 ? scan.mats[0].gps : [];

        const converted = {
            client: scan.clientName,
            clientid: scan.clientId,
            job: scan.jobName,
            jobid: scan.jobId,
            gps,
            time: scan.created,
            deviceid: scan.deviceId,
            mats: this.convertMatsToServerFormat(scan.mats),
        }

        return converted;
    }


    async addNewScan(scan) {

        if (scan.mats.length === 0) {
            return;
        }

      
        const serverScan = this.convertScanToServerFormat(scan);
        let scans = this.getScans();
        scans.push(serverScan);
        fs.writeFileSync(this.scansFile, JSON.stringify(scans, null, 4));
    }

    backupScan(scan) {
        const homeDir = require('os').homedir();
        const fileName = path.join(homeDir, "smartmat",
            `${scan.time} - ${scan.client} - ${scan.job}.json`);

        fs.writeFileSync(fileName, JSON.stringify(scan, null, 4));
    }

    backupFailedScan(scan) {
        const homeDir = require('os').homedir();
        const fileName = path.join(homeDir, "smartmat","failed",
            `${scan.time} - ${scan.client} - ${scan.job}.json`);

        fs.writeFileSync(fileName, JSON.stringify(scan, null, 4));
    }

   async  uploadScans() {

        const { portalUrl } = getConfig();
        const token = new Settings().getToken();

        try {
            const scans = this.getScans();

            if (scans.length === 0) {
                return  Promise.resolve({success: true}); 
            }
            const config = {
                headers: { Authorization: `${token}` }
            };

    
            const promises = _.map(scans, (scan) => {
                 this.backupScan(scan);
                 return axios.post(`${portalUrl}/field-data`, JSON.stringify(scan), config);
            })

            return Promise.all(promises).then(values=>{ 
               const failedScans = _.filter(values, value => value.data !== "Success");
                if (failedScans.length >0 ) {
                     _.map(failedScans, (scan)=> {
                        this.backupFailedScans(scan);
                     });
                     throw `upload failed - ${found.data}`;
                } else {
                     return  Promise.resolve({success: true}); 
                }
              
            }).catch (err=> {
             
               return  Promise.resolve({success: false, error: err}); 
            })
             
        } catch (ex) {
          
             return  Promise.resolve({success: false, error: ex}); 
        } 
    }

    clearScans() {
        try {
            fs.writeFileSync(this.scansFile, JSON.stringify([], null, 4));
        } catch (ex) {
            console.log("Error occurred when clearing scans...", ex);
        }
    }
}

module.exports = Scans;
