const ContaminationJob = require("./job-contamination");
const BrandingJob = require("./job-branding");

function createJob(mainWindow, yumaServices, jobType) {
    if (jobType === "contamination") {
        return new ContaminationJob(mainWindow, yumaServices);
    } else if (jobType === "branding") {
        return new BrandingJob(mainWindow, yumaServices);
    }

    return null;
}

module.exports = { createJob };