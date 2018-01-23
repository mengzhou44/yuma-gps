const ContaminationJob = require("./job-contamination");

function createJob(mainWindow, yumaServices, jobType) {
    if (jobType === "contamination") {

        return new ContaminationJob(mainWindow, yumaServices);
    }

    return null;

}

module.exports = { createJob };