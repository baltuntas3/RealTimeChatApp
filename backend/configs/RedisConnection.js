const { createClient } = require("redis");
const errorMessage = require("../middlewares/ErrorHandler");
require("dotenv").config();

const client = createClient({
    // redis://username:password@ip:port
    url: process.env.REDIS_CONNECTION || "redis://default@127.0.0.1:6379",
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
    },
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Connected to Redis"));
client.on("end", () => console.log("Disconnected from Redis"));

async function connect() {
    await client.connect();
}
connect();

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

async function close() {
    await client.quit();
}

module.exports = {
    getValueRedis,
    setValueRedis,
    updateExistKey,
    delKeyRedis,
    close,
};

// const { createClient } = require("redis");
// const errorMessage = require("../middlewares/ErrorHandler");
// require("dotenv").config();

// class RedisConnection {
//     constructor() {
//         this.client = null;
//         this.connect();
//     }

//     async connect() {
//         this.client = createClient({
//             // redis://username:password@ip:port
//             url: process.env.REDIS_CONNECTION || "redis://default@127.0.0.1:6379",
//             socket: {
//                 reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
//             },
//         });
//         await this.client.connect();

//         this.client.on("connect", () => {
//             console.log("Connected to Redis");
//         });

//         this.client.on("error", (err) => {
//             console.error("Redis error:", err);
//         });

//         this.client.on("end", () => {
//             console.log("Disconnected from Redis");
//         });
//     }

//     async getValueRedis(key) {
//         const getKey = await this.client.get(key);
//         return getKey ? getKey : null;
//     }

//     async setValueRedis(key, val) {
//         const setKey = await this.client.set(key, val);
//         if (setKey !== "OK") throw errorMessage("Redis set value crash!");
//         return true;
//     }

//     async updateExistKey(key, keyToUpdate) {
//         const setKey = await this.client.sendCommand(["RENAME", key, keyToUpdate]);
//         if (setKey !== "OK") throw errorMessage("Redis set value crash!");
//     }

//     async delKeyRedis(key) {
//         await this.client.sendCommand(["DEL", key]);
//     }

//     close() {
//         this.client.quit();
//     }
// }

// module.exports = new RedisConnection();
