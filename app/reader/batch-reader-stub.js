const _ = require('lodash');
const { ReaderStub } = require("./batch-reader");

class BatchReaderStub {

    constructor(mainWindow, yumaServices, batchSize) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;
        this.timer = null;
        this.batchSize = batchSize;
        this.batchTags = [];
        this.tags = [];
    }


    getData() {
        return this.tags;
    }

    clearData() {
        this.tags = [];
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    createRandomString(length) {
        var str = "";
        for (; str.length < length; str += Math.random().toString(36).substr(2));
        return str.substr(0, length);
    }

    start() {
        this.timer = setInterval(() => {
            const tagNumber = "AAA" + this.createRandomString(4);
            this.yumaServices.getGPSData().then(location => {
                console.log("batch-reader-stub:step1");
                const found = _.find(this.batchTags, (tag) => tag.tagNumber === tagNumber);
                console.log("batch-reader-stub:step2");
                if (!found) {
                    console.log("batch-reader-stub:step3");
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
                    console.log("batch-reader-stub: mat-found");
                    this.mainWindow.webContents.send('mat:found', result);

                }
            });

        }, 2000);
    }


    processBatch(contaminated) {
        stop();
        if (this.batchTags.length !== this.batchSize) {
            start();
            return { error: `Error occurred when processing batch .. ` };
        }
        _.map(this.batchTags, tag => {
            tag.contaminated = contaminated;
            this.tags.push(tag);
        });
        this.batchTags = [];

        start();
        return {};
    }

}

module.exports = BatchReaderStub;


