const mongoose = require("mongoose");

async function main() {
    const {MONGO_CONNECTION} = process.env;
    await mongoose.connect(MONGO_CONNECTION, {useUnifiedTopology: true, useNewUrlParser: true});
    console.log("connected to mongodb");
}

main();
