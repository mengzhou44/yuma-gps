const tcpp = require('tcp-ping');

const Settings = require('../settings/settings');
const { getConfig } = require("../config");

const Reader = require("./reader");
const ReaderStub = require("./reader-stub");

function getReader(mainWindow, yumaServices) {
    if (getConfig().useStub) {
        return new ReaderStub(mainWindow, yumaServices);
    }
    return new Reader(mainWindow, yumaServices);
}

function checkReader() {
    if (getConfig().useStub) {
        return true;
    }

    const { reader } = new Settings().fetch();
    return new Promise(resolve => {
        tcpp.probe(reader.host, reader.port, function (err, available) {
            resolve(available);
        });
    });
}

module.exports = { getReader, checkReader };