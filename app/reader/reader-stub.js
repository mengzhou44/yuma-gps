const _ = require('lodash');
const Tags = require("../tags");

class ReaderStub {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;
        this.mats = [];
        this.timer = null;
        this.matsInRange = [];
        this.knownTags = new Tags().getTags();
    }


    getRandomTagNumber() {
        var result;
        var count = 0;
        for (var prop in this.knownTags)
            if (Math.random() < 1 / ++count)
                result = prop;
        return result;
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
            return timeStamp < (mat.timeStamp + 3000)
        });
    }


    start() {
        this.timer = setInterval(() => {
            const tagNumber = this.getRandomTagNumber();
            const matId = new Tags().findMatId(this.knownTags, tagNumber);
            this.updateMatsInRange(matId);
            this.yumaServices.getGPSData().then(location => {

                const found = _.find(this.mats, (mat) => mat.matId === matId);
                if (found) {
                    found.timeStamp = Math.floor(Date.now());
                } else {
                    const timeStamp = Math.floor(Date.now());
                    const mat = {
                        matId,
                        gps: [location.latitude, location.longitude],
                        timeStamp
                    };
                    this.mats.push(mat);
                }

                this.mainWindow.webContents.send('mat:found',
                    {
                        found: this.mats.length,
                        inRange: this.matsInRange.length
                    });
            });

        }, 2000);
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
            inRange: this.matsInRange.length,
        };

        this.mainWindow.webContents.send('mat:found', result);
        setTimeout(() => {
            this.start();
        }, 500);
    }

    getData() {
        return this.mats;
    }

    clearData() {
        this.mats = [];
        this.matsInRange = [];
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }
}

module.exports = ReaderStub;


