const _ = require('lodash');
var { Socket } = require('net');
const Settings = require('../settings/settings');
const Tags = require("../tags");

class Reader {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;
        this.mats = [];
        this.matsInRange = [];
        this.knownTags = new Tags().getTags();
    }

    updateMatsInRange(matId) {
        let found = _.find(this.matsInRange, (mat) => mat.matId === matId);
        if (found) {
            found.timeStamp = Math.floor(Date.now());
        } else {
            const timeStamp = Math.floor(Date.now());
            const mat = {
                matId,
                timeStamp
            };
            this.matsInRange.push(mat);
        }

        this.matsInRange = _.filter(this.matsInRange, (mat) => {
            const timeStamp = Math.floor(Date.now());
            return timeStamp < (mat.timeStamp + 2000)
        });
    }

    processTag(line) {

        const fields = line.toString().split(",");
        if (fields.length === 5) {
            const tagNumber = fields[1];
            if (tagNumber.length > 12) {
                console.log("exception: ", line);
                return;
            }
            const matId = new Tags().findMatId(this.knownTags, tagNumber);
            if (matId === "-1") return;

            this.updateMatsInRange(matId);

            let found = _.find(this.mats, (mat) => mat.matId === matId);
            if (!found) {
                this.yumaServices.getGPSData().then(location => {
                    const timeStamp = Math.floor(Date.now());
                    const mat = {
                        matId,
                        gps: `${location.latitude},${location.longitude}`,
                        timeStamp
                    };
                    this.mats.push(mat);
                    this.mainWindow.webContents.send('mat:found',
                        {
                            processed: this.mats.length,
                            inRange: this.matsInRange.length
                        });
                });
            } else {
                found.timeStamp = Math.floor(Date.now());
                this.mainWindow.webContents.send('mat:found',
                    {
                        processed: this.mats.length,
                        inRange: this.matsInRange.length
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
        return this.mats;
    }

    clearData() {
        this.mats = [];
        this.matsInRange = [];
    }
}

module.exports = Reader;




