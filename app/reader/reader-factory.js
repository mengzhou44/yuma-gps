const Reader = require('./reader');
const ReaderStub = require('./reader-stub');

const BatchReader = require('./batch-reader');
const BatchReaderStub = require('./batch-reader-stub');

let useStub = true;

function getReader(mainWindow, yumaServices) {
    if (useStub) {
        return new ReaderStub(mainWindow, yumaServices);
    }
    return new Reader(mainWindow, yumaServices);
}

function getBatchReader(mainWindow, yumaServices, batchSize) {
    if (useStub) {
        return new BatchReaderStub(mainWindow, yumaServices, batchSize);
    }
    return new BatchReader(mainWindow, yumaServices, batchSize);
}

function checkReader() {
    if (useStub) {
        return true;
    }

    const { reader } = new Settings().fetch();
    return new Promise(resolve => {
        tcpp.probe(reader.host, reader.port, function (err, available) {
            resolve(available);
        });
    });
}

module.exports = { getReader, getBatchReader, checkReader };