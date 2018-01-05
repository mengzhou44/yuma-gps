const _ = require('lodash');
const ReaderStub = require("./reader-stub");

class BatchReaderStub extends ReaderStub {

    constructor(mainWindow, yumaServices, batchSize) {
        super(mainWindow, yumaServices);
        this.batchSize = batchSize;
        this.batchMats = [];
    }


    start() {
        this.timer = setInterval(() => {
            const matId = "MAT" + this.createRandomString(12);
            this.yumaServices.getGPSData().then(location => {

                const found = _.find(this.batchMats, (mat) => mat.matId === matId);

                if (!found) {

                    const timeStamp = Math.floor(Date.now());
                    const mat = {
                        matId,
                        gps: `${location.latitude},${location.longitude}`,
                        timeStamp
                    };

                    if (this.batchMats.length <= this.batchSize) {
                        this.batchMats.push(mat);
                    }

                    const result = {
                        processed: this.mats.length,
                        batch: this.batchMats.length,
                        overflow: this.batchMats.length > this.batchSize
                    };

                    this.mainWindow.webContents.send('mat:found', result);

                }
            });

        }, 2000);
    }

    processBatch(data) {

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

module.exports = BatchReaderStub;


