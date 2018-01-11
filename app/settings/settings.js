const fs = require("fs");
const path = require("path");

const { environment } = require('../environment');


class Settings {
    constructor() {
        if (environment === "production") {
            this.jsonFile = path.join(process.resourcesPath, "settings.json");
        } else {
            this.jsonFile = path.join(__dirname, "settings.json");
        }
    }

    fetch() {
        var text = fs.readFileSync(this.jsonFile);
        return JSON.parse(text);

    }

    getToken() {
        const { tablet } = this.fetch();
        return tablet.token;
    }


    save(data) {
        fs.writeFileSync(this.jsonFile, JSON.stringify(data, null, 4));
    }
}

module.exports = Settings; 