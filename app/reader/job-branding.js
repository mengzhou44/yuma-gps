
const _ = require('lodash');
const uuid = require("uuid/v4");

class BrandingJob {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;

        this.matsBranded = [];
        this.matsInRange = [];
        this.matsInRangeTimer = null;
        this.location = { latitude: 0, longitude: 0 };
    }

    updateMatsInRange(tagNumber) {

        let tagFound = _.find(this.matsInRange, (tag) => tag.tagNumber === tagNumber);
        if (tagFound) {
            tagFound.timeStamp = Math.floor(Date.now());

        } else {
            const timeStamp = Math.floor(Date.now());
            const mat = {
                tagNumber,
                timeStamp
            };
            this.matsInRange.push(mat);
        }
    }

    getMatsInRangeInfo() {
        return _.map(this.matsInRange, mat => mat.tagNumber);
    }


    renewMatsInRange() {
        this.matsInRange = _.filter(this.matsInRange, (mat) => {
            const timeStamp = Math.floor(Date.now());
            return timeStamp < (mat.timeStamp + 2000)
        });

        try {
            this.mainWindow.webContents.send('mat:found',
                {
                    matsBranded: this.matsBranded.length,
                    matsInRange: this.getMatsInRangeInfo()
                });

        } catch (err) {
            console.log("main window was destroyed!");
        }
    }

    async  processTag(tagNumber) {

      
        this.updateMatsInRange(tagNumber);

        const result = {
            matsBranded: this.matsBranded.length,
            matsInRange: this.getMatsInRangeInfo()
        };

        this.mainWindow.webContents.send("mat:found", result);

    }


    isBranded(tagNumber) {

           _.forEach(this.matsBranded, mat => { 
               _.forEach(mat.tags, tag=> {
                    console.log(`${tag}=== ${tagNumber}`, tag === tagNumber)
                    if (tag === tagNumber) {
                        console.log("return true");
                        return true;
                    }
               })      
                
           });
        
           return false; 
    }

    async processBatch(data) {

        try {
            this.location = await this.yumaServices.getGPSData();
        } catch (ex) {
        }

        _.map(this.matsInRange, mat => {

            const isBranded = this.isBranded(mat.tagNumber);
            if (isBranded === true) {
                console.log("isBranded is true");
            } else {

                const temp = {
                    tags: [mat.tagNumber],
                    matId: uuid(),
                    timeStamp: Math.floor(Date.now()),
                    gps: [this.location.longitude, this.location.latitude],
                    branded: true
                };
                this.matsBranded.push(temp);
            }
        });

        this.matsInRange = [];

        const result = {
            matsBranded: this.matsBranded.length,
            matsInRange: this.getMatsInRangeInfo()
        };

        this.mainWindow.webContents.send('mat:found', result);
    }

    async start() {
        this.matsInRangeTimer = setInterval(
            this.renewMatsInRange.bind(this),
            1000);
        this.location = await this.yumaServices.getGPSData();
    }

    clearData() {
        this.matsBranded = [];
        this.matsInRange = [];
    }

    getData() {
        return this.matsBranded;
    }

    stop() {
        clearInterval(this.matsInRangeTimer);
        this.matsInRangeTimer = null;
    }
}

module.exports = BrandingJob;

