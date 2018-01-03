const _ = require('lodash');
var { Socket } = require('net');
const Settings = require('../settings/settings');
const Tags = require("../tags");

class Reader {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;
        this.tags = [];
        this.knownTags = new Tags().getTags();
    }

    processTag(line) {
        const fields = line.toString().split(",");
        if (fields.length === 5) {
            const tagNumber = fields[1];
            const isUnknown = new Tags().checkIfTagIsUnknown(this.knownTags, tagNumber);
            if (isUnknown) return;

            const found = _.find(this.tags, (tag) => tag.tagNumber === tagNumber);
            if (!found) {
                this.yumaServices.getGPSData().then(location => {
                    const timeStamp = Math.floor(Date.now());
                    const tag = {
                        tagNumber,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        timeStamp
                    };

                    this.tags.push(tag);
                    this.mainWindow.webContents.send('mat:found', { processed: this.tags.length });
                });
            }
        }
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
        if (this.tcpClient) {
            this.tcpClient.destroy();
        }

        this.tcpClient = null;
    }

    getData() {
        return this.tags;
    }

    clearData() {
        this.tags = [];
    }
}

module.exports = Reader;




