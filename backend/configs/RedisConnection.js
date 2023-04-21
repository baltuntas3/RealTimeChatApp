const { createClient } = require("redis");
const errorMessage = require("../helpers/ErrorHandling");
// localhost on port 6379.
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

async function getValueRedis(key) {
    const [cnn, getKey, quit] = await Promise.all([client.connect(), client.get(key), client.quit()]);
    return getKey;
}

async function setValueRedis(key, val) {
    const [cnn, setKey, quit] = await Promise.all([client.connect(), client.set(key, val), client.quit()]);
    if (setKey === "OK") throw errorMessage("Redis set value crash!");
}

module.exports = {
    getValueRedis,
    setValueRedis,
};
