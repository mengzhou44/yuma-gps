const path = require("path");
const fs = require("fs");
const axios = require("axios");
const _ = require("lodash");
const { getConfig } = require("./config");
const Settings = require("./settings/settings");

const  environment  = require('./environment');

class Tags {

    constructor() {
        this.tagsFile = path.join(__dirname, "data/tags.json");
        if (environment === "production") {
            this.tagsFile = path.join(process.resourcesPath, "tags.json");
        }
    }

    getTags() {
        const text = fs.readFileSync(this.tagsFile);
        return JSON.parse(text);
    }

    findMatId(table, tagNumber) {
        if (table[tagNumber]) {
            return table[tagNumber];
        }
        return "-1";
    }

    async downloadTags() {
        const { portalUrl } = getConfig();
        const settings = new Settings();
        const token = settings.getToken();


        const tagsUrl = `${portalUrl}/tags`;
        try {
            const config = {
                headers: { Authorization: `${token}` }
            };

            const res = await axios.get(tagsUrl, config);

            res.data;
            let temp = {};

            _.map(res.data, (item) => {
                temp[item[0]] = item[1];
            });

            fs.writeFileSync(this.tagsFile, JSON.stringify(temp, null, 4));
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    }
}

module.exports = Tags;