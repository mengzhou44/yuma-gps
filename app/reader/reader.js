const tcpp = require('tcp-ping');
const _ = require('lodash');
var { Socket } = require('net');
const Settings = require('../settings/settings');




class Reader {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;
        this.tags = [];
        this.tcpClient = new Socket();
        this.tcpClient.on('error', this.onError.bind(this));
        this.tcpClient.on('data', this.onData.bind(this));
    }

    processTag(line) {
        const fields = line.toString().split(",");
        if (fields.length === 5) {
            const tagNumber = fields[1];

            this.yumaServices.getGPSData().then(location => {

                const found = _.find(this.tags, (tag) => tag.tagNumber === tagNumber);
                if (!found) {
                    const tag = {
                        tagNumber,
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    this.tags.push(tag);
                    this.mainWindow.webContents.send('mat:found');
                }
            });
        }
    }


    getReaderSetting() {
        const settings = new Settings();
        const { reader } = settings.fetch();
        return reader;
    }


    check() {
        const readerSetting = getReaderSetting();
        return new Promise(resolve => {
            tcpp.probe(readerSetting.host, readerSetting.port, function (err, available) {
                resolve(available);
            });
        });
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
        const readerSetting = this.getReaderSetting();
        this.tcpClient.connect(readerSetting.host, readerSetting.port);
    }

    stop() {
        this.tcpClient.destroy();
    }
}

module.exports = Reader;
