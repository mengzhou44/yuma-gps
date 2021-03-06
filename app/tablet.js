const { getMac } = require("getmac");
const { getConfig } = require("./config");
const Settings = require("./settings/settings");

const axios = require("axios");

class Tablet {

    getMacAddress() {
        return new Promise((resolve, reject) => {
            getMac(function (err, macAddress) {
                if (err) {
                    reject(err);
                } else {
                    resolve(macAddress)
                }
            })

        });
    }



    async register(macAddress) {
        const { portalUrl } = getConfig();
        try {
            const res = await axios.post(`${portalUrl}/register`, { macAddress });
            const token = res.data.token;
            const settings = new Settings();
            const fetched = settings.fetch();
            fetched.tablet = {
                token
            };
            settings.save(fetched);
            return {};

        } catch (exception) {
            return { error: "Error occurred when registering the tablet." }
        }
    }
}

module.exports = Tablet;