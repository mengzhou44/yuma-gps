const { Reader, check } = require('./reader');
const { ReaderStub } = require('./reader-stub');

let useStub = true;

function getReader(mainWindow, yumaServices) {
    if (useStub) {
        return new ReaderStub(mainWindow, yumaServices);
    }
    return new Reader(mainWindow, yumaServices);
}

function checkReader() {
    if (useStub) {
        return true;
    }

    return check();
}



module.exports = { getReader, checkReader };