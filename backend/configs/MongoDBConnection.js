const mongoose = require("mongoose");
const logger = require('./Logger');

async function main() {
    try {
        const {MONGO_CONNECTION} = process.env;
        await mongoose.connect(MONGO_CONNECTION, {useUnifiedTopology: true, useNewUrlParser: true});
        logger.logDatabase('Connected to MongoDB', {
            connectionString: MONGO_CONNECTION?.replace(/\/\/.*@/, '//***:***@')
        });
    } catch (err) {
        logger.error('Failed to connect to MongoDB', {
            error: err.message,
            connectionString: process.env.MONGO_CONNECTION?.replace(/\/\/.*@/, '//***:***@')
        });
        throw err;
    }
}

main();
