const _ = require('lodash');
const ReaderStub = require("./reader-stub");

class BatchReaderStub extends ReaderStub {

    constructor(mainWindow, yumaServices, batchSize) {
        super(mainWindow, yumaServices);
        this.batchSize = batchSize;
        this.batchTags = [];
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
                        gps: [location.latitude, location.longitude],
                        timeStamp
                    };

                    if (this.batchTags.length <= this.batchSize) {
                        this.batchTags.push(tag);
                    }

                    const result = {
                        processed: this.tags.length,
                        batch: this.batchTags.length,
                        overflow: this.batchTags.length > this.batchSize
                    };

                    this.mainWindow.webContents.send('mat:found', result);

                }
            });

        }, 2000);
    }

    processBatch(data) {

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
            overflow: false
        };

        this.mainWindow.webContents.send('mat:found', result);

        this.start();
    }

}

module.exports = BatchReaderStub;


