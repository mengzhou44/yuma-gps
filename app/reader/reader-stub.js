const _ = require('lodash');

class ReaderStub {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;
        this.mats = [];
        this.timer = null;
        this.matsInRange = [];
    }


    createRandomString(length) {
        var str = "";
        for (; str.length < length; str += Math.random().toString(36).substr(2));
        return str.substr(0, length);
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
            const matId = "MAT" + this.createRandomString(12);
            this.updateMatsInRange(matId);
            this.yumaServices.getGPSData().then(location => {

                const found = _.find(this.mats, (mat) => mat.matId === matId);
                if (found) {
                    found.timeStamp = Math.floor(Date.now());
                } else {
                    const timeStamp = Math.floor(Date.now());
                    const mat = {
                        matId,
                        gps: `${location.latitude},${location.longitude}`,
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


