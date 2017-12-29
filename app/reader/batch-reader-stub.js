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

    createRandomString(length) {
        var str = "";
        for (; str.length < length; str += Math.random().toString(36).substr(2));
        return str.substr(0, length);
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


    start() {
        this.timer = setInterval(() => {
            const tagNumber = "AAA" + this.createRandomString(4);
            this.yumaServices.getGPSData().then(location => {

                const found = _.find(this.batchTags, (tag) => tag.tagNumber === tagNumber);
                if (!found) {
                    const timeStamp = Math.floor(Date.now());
                    const tag = {
                        tagNumber,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        timeStamp
                    };

                    this.batchTags.push(tag);
                    this.mainWindow.webContents.send('mat:found', { processed: this.tags.length, batch: this.batchTags.length });

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


