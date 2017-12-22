const _ = require('lodash');

class ReaderStub {

    constructor(mainWindow, yumaServices) {
        this.mainWindow = mainWindow;
        this.yumaServices = yumaServices;
        this.tags = [];
        this.timer = null;
    }

    check() {
        return true;
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
                    const tag = {
                        tagNumber,
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    this.tags.push(tag);
                    this.mainWindow.webContents.send('mat:found');
                }
            });

        }, 2000);
    }

    stop() {
        clearInterval(this.timer);
    }
}

module.exports = ReaderStub;


