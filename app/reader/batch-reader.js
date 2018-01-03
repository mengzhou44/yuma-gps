const tcpp = require('tcp-ping');
const _ = require('lodash');
var { Socket } = require('net');
const Settings = require('../settings/settings');
const Reader = require("./reader");
const Tags = require("../tags");


class BatchReader extends Reader {

    constructor(mainWindow, yumaServices, batchSize) {
        super(mainWindow, yumaServices);
        this.batchSize = batchSize;
        this.batchTags = [];
        this.knownTags = new Tags().getTags();
        this.rssiThreshold = this.getRSSIThreshold();
    }

    getRSSIThreshold() {
        const settings = new Settings();
        const { contamination } = settings.fetch();
        return contamination.rssiThreshold;
    }

    processTag(line) {
        const fields = line.toString().split(",");
        if (fields.length === 5) {
            const tagNumber = fields[1];


            const isUnknown = new Tags().checkIfTagIsUnknown(this.knownTags, tagNumber);
            if (isUnknown === true) return;

            const existed = _.find(this.tags, (tag) => tag.tagNumber === tagNumber);
            if (existed) return; // ignore the tag that is already processed.

            //Not sure which field is rssi, we assume it is fields[3]
            const rssi = parseFloat(fields[3]);
            if (rssi < this.rssiThreshold) {
                return;
            }  // if tag has a weak strength, ignore it. 

            const found = _.find(this.batchTags, (tag) => tag.tagNumber === tagNumber);
            if (found) {
                return;  // ignore if the tag  already exists in the  batch
            }


            this.yumaServices.getGPSData().then(location => {
                const timeStamp = Math.floor(Date.now());
                const tag = {
                    tagNumber,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    timeStamp
                };
                this.batchTags.push(tag);
                const result = {
                    processed: this.tags.length,
                    batch: this.batchTags.length,
                    batchFull: this.batchTags.length === this.batchSize
                };
                this.mainWindow.webContents.send('mat:found', result);
            });

        }
    }



    processBatch(data) {
        if (this.batchTags.length !== this.batchSize) {
            return;
        }
        this.stop();
        _.map(this.batchTags, tag => {

            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    tag[prop] = data[prop];
                }
            }
            this.tags.push(tag);
        });
        this.batchTags = [];

        const result = {
            processed: this.tags.length,
            batch: this.batchTags.length,
            batchFull: this.batchTags.length === this.batchSize
        };

        this.mainWindow.webContents.send('mat:found', result);

        this.start();
    }

}

module.exports = BatchReader;









