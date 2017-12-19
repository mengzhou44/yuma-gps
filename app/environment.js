const environment = getEnvironment();

function getEnvironment() {
    if (process.mainModule.filename.indexOf('app.asar') !== -1) {
        return "production";
    } else if (process.platform === 'darwin') {
        return "dev";
    }
    return "test";
}


module.exports = { environment }; 