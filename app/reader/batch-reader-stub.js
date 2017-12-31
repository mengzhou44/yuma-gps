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

                const found = _.find(this.batchTags, (tag) => tag.tagNumber === tagNumber);

                if (!found) {

                    const timeStamp = Math.floor(Date.now());
                    const tag = {
                        tagNumber,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        timeStamp
                    };

                    if (this.batchTags.length < this.batchSize) {
                        this.batchTags.push(tag);
                        const result = {
                            processed: this.tags.length,
                            batch: this.batchTags.length,
                            batchFull: this.batchTags.length === this.batchSize
                        };

                        this.mainWindow.webContents.send('mat:found', result);
                    }
                }
            });

        }, 2000);
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

module.exports = BatchReaderStub;


