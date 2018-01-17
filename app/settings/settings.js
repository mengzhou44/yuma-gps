const fs = require("fs-extra");
const path = require("path");

const { environment } = require('../environment');


class Settings {


    constructor() {

        const homeDir = require('os').homedir();
        this.jsonFile = path.join(homeDir, "smartmat", "settings.json");

    }

    createJsonFile() {
        try{
            const myDefault =
            {
                "portal": {
                    "url": "http://empirelinux.com:9000"
                },
                "reader": {
                    "host": "speedwayr-xx-xx-xx.local",
                    "port": 14250
                },
                "tablet": {
                }
            };

        fs.outputFileSync(this.jsonFile, JSON.stringify(myDefault, null, 4));
    
        }catch (error) {
           console.log("Eerror: ", error);
        }

    }

    fetch() {
        if (!fs.existsSync(this.jsonFile)) {
            this.createJsonFile();
        }

        var text = fs.readFileSync(this.jsonFile);
        return JSON.parse(text);
    }

    getToken() {
        const { tablet } = this.fetch();
        return tablet.token;
    }


    save(data) {
        fs.outputFileSync(this.jsonFile, JSON.stringify(data, null, 4));
    }
}

module.exports = Settings; 