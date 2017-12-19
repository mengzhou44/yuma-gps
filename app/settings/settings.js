const fs = require("fs");
const path = require("path");


class Settings {
    constructor() {
        this.jsonFile = path.join(__dirname, "settings.json");
    }

    fetch() {
        var text = fs.readFileSync(this.jsonFile);
        return JSON.parse(text);

    }

    save(data) {
        fs.writeFileSync(this.jsonFile, JSON.stringify(data));
    }
}

module.exports = Settings; 