const { createJob } = require("./job-factory");
const Tags = require("../tags");

class ReaderStub {

    constructor(mainWindow, yumaServices, jobType) {
        this.timer = null;
        this.job = createJob(mainWindow, yumaServices, jobType);
    }

    getRandomTagNumber() {
        var result;
        var count = 0;
        const knownTags = new Tags().getTags();
        for (var prop in knownTags)
            if (Math.random() < 1 / ++count)
                result = prop;
        return result;
    }

    start() {
        this.timer = setInterval(async () => {
            const tagNumber = this.getRandomTagNumber();
            await this.job.processTag(tagNumber);
        }, 1000);

        this.job.start();
    }

    processBatch(data) {
        this.stop();
        this.job.processBatch(data);
        setTimeout(() => {
            this.start();
        }, 500);
    }

    getData() {
        return this.job.getData();
    }

    clearData() {
        this.job.clearData();
    }

    stop() {
        this.job.stop();
        clearInterval(this.timer);
        this.timer = null;
    }
}

module.exports = ReaderStub;


