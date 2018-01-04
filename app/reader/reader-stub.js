const _ = require('lodash');

class ReaderStub {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;
        this.tags = [];
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

                const found = _.find(this.tags, (tag) => tag.tagNumber === tagNumber);
                if (!found) {
                    const timeStamp = Math.floor(Date.now());
                    const tag = {
                        tagNumber,
                        gps: [location.latitude, location.longitude],
                        timeStamp
                    };

                    this.tags.push(tag);
                    this.mainWindow.webContents.send('mat:found', { processed: this.tags.length });

                }
            });

        }, 2000);
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
}

module.exports = ReaderStub;


