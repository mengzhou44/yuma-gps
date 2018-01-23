
const _ = require('lodash');
const Tags = require("../tags");

class ContaminationJob {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;

        this.mats = [];
        this.matsInRange = [];
        this.knownTags = new Tags().getTags();
        this.matsInRangeTimer = null;
        this.contamination = { contaminated: 0, decontaminated: 0 };
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
                    contamination: this.contamination,
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
                    contamination: this.contamination,
                    tagsInRange: this.getTagsInRange()
                });
        } else {
            found.timeStamp = Math.floor(Date.now());
        }
    }

    processBatch(data) {

        _.map(this.matsInRange, mat => {
            const found = _.find(this.mats, (item) => item.matId === mat.matId);
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    found[prop] = data[prop];
                }
            }
        });
        this.matsInRange = [];
        this.contamination = { contaminated: 0, decontaminated: 0 };

        _.map(this.mats, mat => {

            if (mat.contaminated !== undefined) {
                if (mat.contaminated) {
                    this.contamination.contaminated++;
                } else {
                    this.contamination.decontaminated++;
                }

            }
        });

        const result = {
            found: this.mats.length,
            inRange: this.matsInRange.length,
            contamination: this.contamination
        };

        this.mainWindow.webContents.send('mat:found', result);
    }

    async start() {
        this.matsInRangeTimer = setInterval(this.renewMatsInRange.bind(this), 1000);
        this.location = await this.yumaServices.getGPSData();
    }

    clearData() {
        this.mats = [];
        this.matsInRange = [];
        this.contamination = { contaminated: 0, decontaminated: 0 };
    }

    stop() {
        clearInterval(this.matsInRangeTimer);
        this.matsInRangeTimer = null;
    }
}


module.exports = ContaminationJob;

