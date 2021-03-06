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
        if (line.trim() === "") {
            return;
        }

        const fields = line.toString().split(",");

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
                    gps: [location.latitude, location.longitude],
                    timeStamp
                };
                this.mats.push(mat);
                this.mainWindow.webContents.send('mat:found',
                    {
                        found: this.mats.length,
                        inRange: this.matsInRange.length
                    });
            });
        } else {
            found.timeStamp = Math.floor(Date.now());
            this.mainWindow.webContents.send('mat:found',
                {
                    found: this.mats.length,
                    inRange: this.matsInRange.length
                });
        }

    }


    processBatch(data) {
        this.stop();
        _.map(this.matsInRange, mat => {
            const found = _.find(this.mats, (item) => item.matId === mat.matId);
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    found[prop] = data[prop];
                }
            }
        });
        this.matsInRange = [];

        const result = {
            found: this.mats.length,
            inRange: this.matsInRange.length
        };

        this.mainWindow.webContents.send('mat:found', result);
        setTimeout(() => {
            this.start();
        }, 500);
    }

    getReaderSetting() {
        const settings = new Settings();
        const { reader } = settings.fetch();
        return reader;
    }


    onData(data) {
        console.log("data", data);
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




