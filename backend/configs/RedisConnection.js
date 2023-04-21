const { createClient } = require("redis");
// localhost on port 6379.
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
async function getValueRedis(key) {
    console.log(await client.connect());
    // const [cnn, getKey, quit] = await Promise.all([client.connect(), client.get(key), client.quit()]);
    // const [ping, get, quit] = await Promise.all([client.ping(), client.get("key"), client.quit()]); // ['PONG', null, 'OK'] BURASIIIIIIIIIIIIIIII
    // return ping, get, quit;
}

async function setValueRedis(key, val) {
    // const [cnn, setKey, quit] = await Promise.all([client.connect(), client.set(key, val), client.quit()]);
    // return setKey;
}

module.exports = {
    getValueRedis,
    setValueRedis,
};
