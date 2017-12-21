const path = require("path");
const fs = require("fs");

const { environment } = require('./environment');

class Scan {

    constructor() {

    }

    getJobTypes() {
        let jobTypesFile = path.join(__dirname, "data/job-types.json");

        if (environment === "production") {
            jobTypesFile = path.join(process.resourcesPath, "job-types.json");
        }

        var text = fs.readFileSync(jobTypesFile);
        return JSON.parse(text);
    }
}

module.exports = Scan;