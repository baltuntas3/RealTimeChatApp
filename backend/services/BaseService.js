const errorMessage = require("../helpers/ErrorHandling");

module.exports = class Service {
    async findAll() {
        return this.model.find();
    }

    async add(item) {
        return this.model.create(item);
    }

    async del(itemId) {
        return this.model.remove({ _id: itemId });
    }

    async find(itemId) {
        return this.model.findById(itemId);
    }
    //This function in the wrong place
    async findByUserName(username) {
        return this.model.findOne({ userName: username });
    }

    async query(object) {
        return this.model.find(object);
    }

    async queryOne(object) {
        return this.model.findOne(object);
    }

    async findLastItem(object) {
        return this.model.find(object).sort({ createdAt: -1 }).limit(1);
    }

    async update(itemId, set) {
        return this.model.update(itemId, set, { upsert: true });
    }

    handleError(message) {
        return errorMessage(message);
    }
};
