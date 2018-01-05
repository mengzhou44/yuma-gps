const tcpp = require('tcp-ping');
const _ = require('lodash');
var { Socket } = require('net');
const Reader = require("./reader");
const Tags = require("../tags");


class BatchReader extends Reader {

    constructor(mainWindow, yumaServices, batchSize) {
        super(mainWindow, yumaServices);
        this.batchSize = batchSize;
        this.batchMats = [];
    }


    removeExpiredMats() {
        this.batchMats = _.filter(this.batchMats, (mat) => {
            const timeStamp = Math.floor(Date.now());
            return timeStamp < (mat.timeStamp + 2000)
        });
    }

    processTag(line) {
        const fields = line.toString().split(",");
        if (fields.length === 5) {
            const tagNumber = fields[1];

            const matId = new Tags().findMatId(this.knownTags, tagNumber);
            if (matId === "-1") return;

            const existed = _.find(this.mats, (mat) => mat.matId === matId);
            if (existed) return; // ignore the  mat that is already processed.

            this.removeExpiredMats();

            const found = _.find(this.batchMats, (mat) => mat.matId === matId);
            if (found) {
                found.timeStamp = Math.floor(Date.now()); // update timestemp 
            } else {
                this.yumaServices.getGPSData().then(location => {
                    const timeStamp = Math.floor(Date.now());
                    const mat = {
                        matId,
                        gps: `${location.latitude},${location.longitude}`,
                        timeStamp
                    };
                    this.batchMats.push(mat);

                });
            }

            const result = {
                processed: this.mats.length,
                batch: this.batchMats.length,
                overflow: this.batchMats.length > this.batchSize
            };
            this.mainWindow.webContents.send('mat:found', result);

        }
    }

    processBatch(data) {
        if (this.batchMats.length > this.batchSize) {
            return;
        }
        this.stop();

        _.map(this.batchMats, mat => {

            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    mat[prop] = data[prop];
                }
            }
            this.mats.push(mat);
        });
        this.batchMats = [];

        const result = {
            processed: this.mats.length,
            batch: this.batchMats.length,
            overflow: false
        };

        this.mainWindow.webContents.send('mat:found', result);

        this.start();
    }

}

module.exports = BatchReader;









