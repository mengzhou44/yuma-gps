
class ReaderStub {

    constructor(mainWindow, yumaServices) {
        super();
        this.tags = [];
        this.mainWindow = mainWindow;
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
        this.timer = setTimeout(() => {
            const tagNumber = "AAA" + this.createRandomString(4);
            this.yumaServices.getGPSData().then(location => {

                const found = _.find(tags, (tag) => tag.tagNumber === tagNumber);
                if (!found) {
                    const tag = {
                        tagNumber,
                        latitude: location.latitude,
                        longitude: location.longitude
                    };

                    tags.push(tag);
                    this.mainWindow.webContents.send('tag:found', {
                        tag
                    });
                }
            });

        }, 2000);
    }

    stop() {
        this.tags = [];
        clearTimeout(this.timer);
    }
}

module.exports = ReaderStub;


