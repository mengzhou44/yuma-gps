
const _ = require('lodash');
const Tags = require("../tags");

class ScanJob {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;

        this.mats = [];
        this.matsInRange = [];
        this.knownTags = new Tags().getTags();
        this.matsInRangeTimer = null;
        this.location = { latitude: 0, longitude: 0 };
    }

    renewMatsInRange() {
        this.matsInRange = _.filter(this.matsInRange, (mat) => {
            const timeStamp = Math.floor(Date.now());
            return timeStamp < (mat.timeStamp + 2000)
        });

        try {

            this.mainWindow.webContents.send('mat:found',
                {
                    found: this.mats.length,
                    inRange: this.matsInRange.length,
                    tagsInRange: this.getTagsInRange()
                });
        } catch (err) {
            console.log("main window was destroyed!");
        }

    }

    addTag(tagNumber, mat) {
        const found = _.find(mat.tags, item => item === tagNumber);
        if (!found) {
            mat.tags.push(tagNumber);
        }
    }

    getTagsInRange() {
        let result = []
        _.map(this.matsInRange, (mat) => {
            result.push(mat.tags.join());
        })
        return result.join();
    }

    updateMatsInRange(tagNumber) {
        const matId = new Tags().findMatId(this.knownTags, tagNumber);
        let matFound = _.find(this.matsInRange, (mat) => mat.matId === matId);
        if (matFound) {
            matFound.timeStamp = Math.floor(Date.now());
            this.addTag(tagNumber, matFound);
        } else {
            const timeStamp = Math.floor(Date.now());
            const mat = {
                matId,
                timeStamp,
                tags: [tagNumber]
            };
            this.matsInRange.push(mat);
        }
    }


    async  processTag(tagNumber) {
        const matId = new Tags().findMatId(this.knownTags, tagNumber);
        if (matId === "-1") return;

        this.updateMatsInRange(tagNumber);
        try {
            this.location = await this.yumaServices.getGPSData();
        } catch (ex) {
        }

        const timeStamp = Math.floor(Date.now());
        const mat = {
            matId,
            gps: [this.location.longitude, this.location.latitude],
            timeStamp
        };

        let found = _.find(this.mats, (mat) => mat.matId === matId);
        if (!found) {

            this.mats.push(mat);
            this.mainWindow.webContents.send('mat:found',
                {
                    found: this.mats.length,
                    inRange: this.matsInRange.length,
                    tagsInRange: this.getTagsInRange()
                });
        } else {
            found.timeStamp = Math.floor(Date.now());
        }
    }

    processBatch(data) {

    }

    async start() {
        this.matsInRangeTimer = setInterval(this.renewMatsInRange.bind(this), 1000);
        this.location = await this.yumaServices.getGPSData();
    }

    clearData() {
        this.mats = [];
        this.matsInRange = [];
    }

    stop() {
        clearInterval(this.matsInRangeTimer);
        this.matsInRangeTimer = null;
    }
}


module.exports = ScanJob;

