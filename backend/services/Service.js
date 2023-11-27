module.exports = class Service {
    findAll(exceptFields) {
        return this.model.find({}, exceptFields);
    }

    add(item) {
        return this.model.create(item);
    }

    del(documentId) {
        return this.model.remove({_id: documentId});
    }

    find(documentId, exceptFields) {
        return this.model.findById(documentId, exceptFields);
    }
    //This function in the wrong place
    findOneBy(condition, exceptFields) {
        return this.model.findOne(condition, exceptFields);
    }

    query(object, exceptFields) {
        return this.model.find(object, exceptFields);
    }

    queryPagination(findByObject, pageNumber, nPerPage, sort = {createdAt: -1}, exceptFields) {
        return this.model
            .find(findByObject, exceptFields)
            .sort(sort)
            .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
            .limit(nPerPage);
    }

    queryOne(object) {
        return this.model.findOne(object);
    }

    findLastItem(object) {
        return this.model.find(object).sort({createdAt: -1}).limit(1);
    }

    update(documentId, set) {
        return this.model.update(documentId, set, {upsert: true});
    }
};
