const path = require("path");
const fs = require("fs");
const axios = require("axios");
const _ = require("lodash");
const { getConfig } = require("./config");

const { environment } = require('./environment');

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

    checkIfTagIsUnknown(tags, tag) {
        if (getConfig().checkKnownTags === true) {
            const found = _.find(tags, (tagNumber) => tagNumber === tag);
            if (found) return false;
            return true;
        }
        return false;
    }

    async downloadTags() {
        const { portalUrl } = getConfig();
        const tagsUrl = `${portalUrl}/tags`;
        try {
            const res = await axios.get(tagsUrl);
            fs.writeFileSync(this.tagsFile, JSON.stringify(res.data, null, 4));
            return { success: true };
        } catch (error) {
            return { success: false };
        }

    }
}

module.exports = Tags;