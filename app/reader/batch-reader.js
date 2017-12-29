const tcpp = require('tcp-ping');
const _ = require('lodash');
var { Socket } = require('net');
const Settings = require('../settings/settings');
const Reader = require("./reader");


class BatchReader {

    constructor(mainWindow, yumaServices, batchSize) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;
        this.batchSize = batchSize;
        this.batchTags = [];
        this.tags = [];
    }

    getReaderSetting() {
        const settings = new Settings();
        const { reader } = settings.fetch();
        return reader;
    }


    onData(data) {
        const lines = data.toString().split("\n");
        _.each(lines, line => {
            this.processTag(line);
        });
    }

    onError(error) {
        this.mainWindow.webContents.send('mat:found', {
            error
        });
    }

    start() {
        this.tcpClient = new Socket();
        this.tcpClient.on('error', this.onError.bind(this));
        this.tcpClient.on('data', this.onData.bind(this));
        const readerSetting = this.getReaderSetting();
        this.tcpClient.connect(readerSetting.port, readerSetting.host);
    }


    stop() {
        this.tcpClient.destroy();
        this.tcpClient = null;
    }

    getData() {
        return this.tags;
    }

    clearData() {
        this.tags = [];
    }

    processTag(line) {
        const fields = line.toString().split(",");
        if (fields.length === 5) {
            const tagNumber = fields[1];
            const existed = _.find(this.tags, (tag) => tag.tagNumber === tagNumber);
            if (existed) return; // ignore the tag that  is already picked.
            const found = _.find(this.batchTags, (tag) => tag.tagNumber === tagNumber);

            if (!found) {
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
    }

    onData(data) {
        this.batchTags = [];
        const lines = data.toString().split("\n");
        _.each(lines, line => {
            this.processTag(line);
        });
    }

    processBatch(data) {
        stop();
        if (this.batchTags.length !== this.batchSize) {
            start();
            return { error: `Error occurred when processing batch .. ` };
        }
        _.map(this.batchTags, tag => {

            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    tag[prop] = data[prop];
                }
            }
            this.tags.push(tag);
        });
        this.batchTags = [];
        start();
        return {};
    }

}

module.exports = BatchReader;









