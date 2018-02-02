const _ = require('lodash');
var { Socket } = require('net');
const Settings = require('../settings/settings');
const { createJob } = require("./job-factory");

class Reader {

    constructor(mainWindow, yumaServices, jobType) {
        this.mainWindow = mainWindow;
        this.job = createJob(mainWindow, yumaServices, jobType);
  
    }

    processBatch(data) {
        this.stop();
        this.job.processBatch(data);

        setTimeout(() => {
            this.start();
        }, 500);
    }

    getReaderSetting() {
        const settings = new Settings();
        const { reader } = settings.fetch();
        return reader;
    }
    onError(error) {
            this.stop();
             this.mainWindow.webContents.send('mat:found',
              { error: `Error occured while scanning. ${error}` });
    }

    onData(data) {
      
        try {
            if (this.tcpClient === null) {
                return;
            }
          

            const lines = data.toString().split("\n");
            _.each(lines, async line => {
                if (line.trim() === "") {
                    return;
                }

                 const fields = line.toString().split(",");
                 if (fields.length !==4 ) {
                     return;
                 }

                 const tagNumber = fields[1];
                 if (tagNumber.length < 6 ) {
                       return;
                 }

                await this.job.processTag(tagNumber);
            });
        } catch (err) {
            this.stop();
            this.mainWindow.webContents.send('mat:found',
                { error: `Error occured while scanning. ${err} ${err.stack}` });
        }
    }

    async start() {
        this.tcpClient = new Socket();
        this.tcpClient.on('data', this.onData.bind(this));
       this.tcpClient.on('error', this.onError.bind(this));
        const readerSetting = this.getReaderSetting();
        this.tcpClient.connect(readerSetting.port, readerSetting.host);
        await this.job.start();
    }

    stop() {
        if (this.tcpClient) {
            this.tcpClient.destroy();
        }
        this.tcpClient = null;
        this.job.stop();
    }

    getData() {
        return this.job.getData();
    }

    clearData() {
        return this.job.clearData();
    }
}

module.exports = Reader;



