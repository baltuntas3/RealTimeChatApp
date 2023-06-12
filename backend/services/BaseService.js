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

    async queryPagination(findByObject, pageNumber, nPerPage, sort = { createdAt: -1 }) {
        return this.model
            .find(findByObject)
            .sort(sort)
            .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
            .limit(nPerPage);
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
};
