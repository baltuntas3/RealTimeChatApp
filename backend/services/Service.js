module.exports = class Service {
    /**
     * Service class for interacting with a database model.
     * @class
     * @example
     * const service = new Service();
     * const allDocuments = service.findAll();
     * const newItem = { name: "John", age: 25 };
     * const addedItem = service.add(newItem);
     * const documentId = "123456789";
     * const deletedItem = service.del(documentId);
     * const foundDocument = service.find(documentId);
     * const condition = { name: "John" };
     * const foundDocumentByCondition = service.findOneBy(condition);
     * const queryObject = { age: { $gt: 20 } };
     * const queriedDocuments = service.query(queryObject);
     * const findByObject = { age: { $gt: 20 } };
     * const pageNumber = 1;
     * const nPerPage = 10;
     * const sortedDocuments = service.queryPagination(findByObject, pageNumber, nPerPage);
     * const lastItem = service.findLastItem();
     * const updatedDocumentId = "123456789";
     * const updateSet = { name: "John Doe" };
     * const updatedDocument = service.update(updatedDocumentId, updateSet);
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Finds all documents in the model, excluding specified fields.
     * @param {Object} exceptFields - The fields to exclude from the result.
     * @returns {Array} - An array of documents.
     */
    findAll(exceptFields) {
        return this.model.find({}, exceptFields);
    }

    /**
     * Adds a new document to the model.
     * @param {Object} item - The document to add.
     * @returns {Object} - The added document.
     */
    add(item) {
        return this.model.create(item);
    }

    /**
     * Deletes a document from the model based on its ID.
     * @param {string} documentId - The ID of the document to delete.
     * @returns {Object} - The deleted document.
     */
    del(documentId) {
        return this.model.remove({_id: documentId});
    }

    /**
     * Finds a document in the model based on its ID, excluding specified fields.
     * @param {string} documentId - The ID of the document to find.
     * @param {Object} exceptFields - The fields to exclude from the result.
     * @returns {Object} - The found document.
     */
    find(documentId, exceptFields) {
        return this.model.findById(documentId, exceptFields);
    }

    /**
     * Finds a document in the model that matches a condition, excluding specified fields.
     * @param {Object} condition - The condition to match.
     * @param {Object} exceptFields - The fields to exclude from the result.
     * @returns {Object} - The found document.
     */
    findOneBy(condition, exceptFields) {
        return this.model.findOne(condition, exceptFields);
    }

    /**
     * Queries documents in the model that match an object, excluding specified fields.
     * @param {Object} object - The object to match.
     * @param {Object} exceptFields - The fields to exclude from the result.
     * @returns {Array} - An array of documents.
     */
    query(object, exceptFields) {
        return this.model.find(object, exceptFields);
    }

    /**
     * Queries documents in the model with pagination, sorting and excluding specified fields.
     * @param {Object} findByObject - The object to match.
     * @param {number} pageNumber - The page number.
     * @param {number} nPerPage - The number of documents per page.
     * @param {Object} sort - The sort order.
     * @param {Object} exceptFields - The fields to exclude from the result.
     * @returns {Array} - An array of documents.
     * @throws {Error} - If `pageNumber` is less than or equal to 0.
     */
    queryPagination(findByObject, pageNumber, nPerPage, sort = {createdAt: -1}, exceptFields) {
        if (pageNumber <= 0) {
            throw new Error("Page number must be greater than 0");
        }
        return this.model
            .find(findByObject, exceptFields)
            .sort(sort)
            .skip((pageNumber - 1) * nPerPage)
            .limit(nPerPage);
    }

    /**
     * Queries a single document in the model that matches an object.
     * @param {Object} object - The object to match.
     * @returns {Object} - The found document.
     */
    queryOne(object) {
        return this.model.findOne(object);
    }

    /**
     * Finds the last item in the model that matches an object.
     * @param {Object} object - The object to match.
     * @returns {Object} - The last found document.
     */
    findLastItem(object) {
        return this.model.find(object).sort({createdAt: -1}).limit(1);
    }

    /**
     * Updates a document in the model based on its ID with the specified set of fields.
     * @param {string} documentId - The ID of the document to update.
     * @param {Object} set - The fields to update.
     * @returns {Object} - The updated document.
     */
    update(documentId, set) {
        return this.model.update(documentId, set, {upsert: true});
    }
};
