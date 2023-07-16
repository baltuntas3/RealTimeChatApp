module.exports = class Service {
    async findAll(exceptFields) {
        return this.model.find({}, exceptFields);
    }

    async add(item) {
        return this.model.create(item);
    }

    async del(documentId) {
        return this.model.remove({ _id: documentId });
    }

    async find(documentId, exceptFields) {
        return this.model.findById(documentId, exceptFields);
    }
    //This function in the wrong place
    async findOneBy(condition, exceptFields) {
        return this.model.findOne(condition, exceptFields);
    }

    async query(object, exceptFields) {
        return this.model.find(object, exceptFields);
    }

    async queryPagination(findByObject, pageNumber, nPerPage, sort = { createdAt: -1 }, exceptFields) {
        return this.model
            .find(findByObject, exceptFields)
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

    async update(documentId, set) {
        return this.model.update(documentId, set, { upsert: true });
    }
};
