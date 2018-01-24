
const _ = require('lodash');
const uuid = require("uuid/v4");

const Tags = require("../tags");


class BrandingJob {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;

        this.branded = [];
        this.tagsInRange = [];
        this.knownTags = new Tags().getTags();
        this.tagsInRangeTimer = null;
        this.location = { latitude: 0, longitude: 0 };
    }

    updateTagsInRange(tagNumber) {

        let tagFound = _.find(this.tagsInRange, (tag) => tag.tagNumber === tagNumber);
        if (tagFound) {
            tagFound.timeStamp = Math.floor(Date.now());

        } else {
            const timeStamp = Math.floor(Date.now());
            const tag = {
                tagNumber,
                timeStamp
            };
            this.tagsInRange.push(tag);
        }
    }

    renewTagsInRange() {
        this.tagsInRange = _.filter(this.tagsInRange, (tag) => {
            const timeStamp = Math.floor(Date.now());
            return timeStamp < (tag.timeStamp + 2000)
        });

        try {
            this.mainWindow.webContents.send('mat:found',
                {
                    branded: this.branded,
                    tagsInRange: this.tagsInRange
                });

        } catch (err) {
            console.log("main window was destroyed!");
        }
    }

    async  processTag(tagNumber) {

        if (this.knownTags[tagNumber] === undefined) {
            return;   // unknown tag
        }

        if (this.knownTags[tagNumber] !== "") {
            return;   // branded tags
        }

        _.map(this.branded, mat => {
            const found = _.find(mat.tags, tag => tag === tagNumber);
            if (found) {
                return; // the tag that is already branded
            }
        });

        updateTagsInRange(tagNumber);
    }

    async processBatch(data) {

        try {
            this.location = await this.yumaServices.getGPSData();
        } catch (ex) {
        }

        const mat = {
            id: uuid(),
            tags: _.map(this.tagsInRange, tag => {
                return tag.tagNumber
            }),
            timeStamp: Math.floor(Date.now()),
            gps: [this.location.longitude, this.location.latitude],
            branded: true
        }
        this.branded.push(mat);

        this.tagsInRange = [];

        const result = {
            branded: this.branded.length,
            tagsInRange: this.tagsInRange,
        };

        this.mainWindow.webContents.send('mat:found', result);
    }



    async start() {
        this.tagsInRangeTimer = setInterval(
            this.renewTagsInRange.bind(this),
            1000);
        this.location = await this.yumaServices.getGPSData();
    }

    clearData() {
        this.branded = [];
        this.tagsInRange = [];
    }

    stop() {
        clearInterval(this.tagsInRangeTimer);
        this.tagsInRangeTimer = null;
    }
}

module.exports = BrandingJob;

