const { getConfig } = require("./config");

const axios = require("axios");

async function checkPortal() {
    const { portalUrl } = getConfig();
    try {
        const res = await axios.get(portalUrl);
        return res.statusText === "OK";
    } catch (e) {
        return false;
    }
}

module.exports = { checkPortal }