const { createClient } = require("redis");
const errorMessage = require("../helpers/ErrorHandling");
require("dotenv").config();

const client = createClient({
    // redis://username:password@ip:port
    url: process.env.REDIS_CONNECTION || "redis://default@127.0.0.1:6379",
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
    },
});
client.on("error", (err) => console.log("Redis Client Error", err));
async function main() {
    await client.connect();
}
main();

async function getValueRedis(key) {
    const getKey = await client.get(key);
    return getKey ? getKey : null;
}

async function setValueRedis(key, val) {
    const setKey = await client.set(key, val);
    if (setKey !== "OK") throw errorMessage("Redis set value crash!");
    return true;
}

async function updateExistKey(key, keyToUpdate) {
    const setKey = await client.sendCommand(["RENAME", key, keyToUpdate]);
    if (setKey !== "OK") throw errorMessage("Redis set value crash!");
}

async function delKeyRedis(key) {
    await client.sendCommand(["DEL", key]);
}

module.exports = {
    getValueRedis,
    setValueRedis,
    updateExistKey,
    delKeyRedis,
};
