const ContaminationJob = require("./job-contamination");
const ScanJob = require("./job-scan");

function createJob(mainWindow, yumaServices, jobType) {
    if (jobType === "contamination") {
        return new ContaminationJob(mainWindow, yumaServices);
    } else if (jobType === "scan") {
        return new ScanJob(mainWindow, yumaServices);
    }

    return null;

}

module.exports = { createJob };