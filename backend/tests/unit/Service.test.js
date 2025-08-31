const Service = require("../../services/Service");

const mockModel = {
    find: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn()
};

describe("Service", () => {
    let service;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new Service(mockModel);
    });

    describe("findAll", () => {
        it("should find all documents", async () => {
            const mockData = [{ id: 1 }, { id: 2 }];
            mockModel.find.mockResolvedValue(mockData);

            const result = await service.findAll();

            expect(mockModel.find).toHaveBeenCalledWith({}, undefined);
            expect(result).toEqual(mockData);
        });

        it("should find all documents excluding specified fields", async () => {
            const mockData = [{ id: 1, name: "test" }];
            const exceptFields = "-password";
            mockModel.find.mockResolvedValue(mockData);

            const result = await service.findAll(exceptFields);

            expect(mockModel.find).toHaveBeenCalledWith({}, exceptFields);
            expect(result).toEqual(mockData);
        });
    });

    describe("add", () => {
        it("should add a new document", async () => {
            const itemToAdd = { name: "test", email: "test@example.com" };
            const createdItem = { _id: "123", ...itemToAdd };
            mockModel.create.mockResolvedValue(createdItem);

            const result = await service.add(itemToAdd);

            expect(mockModel.create).toHaveBeenCalledWith(itemToAdd);
            expect(result).toEqual(createdItem);
        });
    });

    describe("del", () => {
        it("should delete a document by ID", async () => {
            const documentId = "123456789";
            const deletedDoc = { _id: documentId, name: "deleted" };
            mockModel.remove.mockResolvedValue(deletedDoc);

            const result = await service.del(documentId);

            expect(mockModel.remove).toHaveBeenCalledWith({ _id: documentId });
            expect(result).toEqual(deletedDoc);
        });
    });

    describe("find", () => {
        it("should find a document by ID", async () => {
            const documentId = "123456789";
            const foundDoc = { _id: documentId, name: "found" };
            mockModel.findById.mockResolvedValue(foundDoc);

            const result = await service.find(documentId);

            expect(mockModel.findById).toHaveBeenCalledWith(documentId, undefined);
            expect(result).toEqual(foundDoc);
        });

        it("should find a document by ID excluding specified fields", async () => {
            const documentId = "123456789";
            const exceptFields = "-password";
            const foundDoc = { _id: documentId, name: "found" };
            mockModel.findById.mockResolvedValue(foundDoc);

            const result = await service.find(documentId, exceptFields);

            expect(mockModel.findById).toHaveBeenCalledWith(documentId, exceptFields);
            expect(result).toEqual(foundDoc);
        });
    });

    describe("findOneBy", () => {
        it("should find one document by condition", async () => {
            const condition = { name: "test" };
            const foundDoc = { _id: "123", name: "test" };
            mockModel.findOne.mockResolvedValue(foundDoc);

            const result = await service.findOneBy(condition);

            expect(mockModel.findOne).toHaveBeenCalledWith(condition, undefined);
            expect(result).toEqual(foundDoc);
        });

        it("should find one document by condition excluding specified fields", async () => {
            const condition = { name: "test" };
            const exceptFields = "-password";
            const foundDoc = { _id: "123", name: "test" };
            mockModel.findOne.mockResolvedValue(foundDoc);

            const result = await service.findOneBy(condition, exceptFields);

            expect(mockModel.findOne).toHaveBeenCalledWith(condition, exceptFields);
            expect(result).toEqual(foundDoc);
        });
    });

    describe("query", () => {
        it("should query documents by object", async () => {
            const queryObject = { age: { $gt: 20 } };
            const foundDocs = [{ _id: "123", age: 25 }, { _id: "456", age: 30 }];
            mockModel.find.mockResolvedValue(foundDocs);

            const result = await service.query(queryObject);

            expect(mockModel.find).toHaveBeenCalledWith(queryObject, undefined);
            expect(result).toEqual(foundDocs);
        });

        it("should query documents excluding specified fields", async () => {
            const queryObject = { age: { $gt: 20 } };
            const exceptFields = "-password";
            const foundDocs = [{ _id: "123", age: 25 }];
            mockModel.find.mockResolvedValue(foundDocs);

            const result = await service.query(queryObject, exceptFields);

            expect(mockModel.find).toHaveBeenCalledWith(queryObject, exceptFields);
            expect(result).toEqual(foundDocs);
        });
    });

    describe("queryPagination", () => {
        it("should query documents with pagination using default parameters", async () => {
            const findByObject = { status: "active" };
            const pageNumber = 1;
            const nPerPage = 10;
            const mockDocs = [{ _id: "123" }, { _id: "456" }];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockDocs)
            };

            mockModel.find.mockReturnValue(mockQuery);

            const result = await service.queryPagination(findByObject, pageNumber, nPerPage);

            expect(mockModel.find).toHaveBeenCalledWith(findByObject, undefined);
            expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockQuery.skip).toHaveBeenCalledWith(0);
            expect(mockQuery.limit).toHaveBeenCalledWith(10);
            expect(result).toEqual(mockDocs);
        });

        it("should query documents with pagination using custom parameters", async () => {
            const findByObject = { status: "active" };
            const pageNumber = 3;
            const nPerPage = 5;
            const customSort = { name: 1 };
            const exceptFields = "-password";
            const mockDocs = [{ _id: "123" }];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockDocs)
            };

            mockModel.find.mockReturnValue(mockQuery);

            const result = await service.queryPagination(findByObject, pageNumber, nPerPage, customSort, exceptFields);

            expect(mockModel.find).toHaveBeenCalledWith(findByObject, exceptFields);
            expect(mockQuery.sort).toHaveBeenCalledWith(customSort);
            expect(mockQuery.skip).toHaveBeenCalledWith(10);
            expect(mockQuery.limit).toHaveBeenCalledWith(5);
            expect(result).toEqual(mockDocs);
        });

        it("should throw error for invalid page number", () => {
            const findByObject = { status: "active" };
            const invalidPageNumber = 0;
            const nPerPage = 10;

            expect(() => {
                service.queryPagination(findByObject, invalidPageNumber, nPerPage);
            }).toThrow("Page number must be greater than 0");

            expect(() => {
                service.queryPagination(findByObject, -1, nPerPage);
            }).toThrow("Page number must be greater than 0");
        });
    });

    describe("queryOne", () => {
        it("should query single document by object", async () => {
            const queryObject = { email: "test@example.com" };
            const foundDoc = { _id: "123", email: "test@example.com" };
            mockModel.findOne.mockResolvedValue(foundDoc);

            const result = await service.queryOne(queryObject);

            expect(mockModel.findOne).toHaveBeenCalledWith(queryObject);
            expect(result).toEqual(foundDoc);
        });
    });

    describe("findLastItem", () => {
        it("should find the last item by object", async () => {
            const queryObject = { groupId: "123" };
            const lastItem = [{ _id: "456", groupId: "123" }];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(lastItem)
            };

            mockModel.find.mockReturnValue(mockQuery);

            const result = await service.findLastItem(queryObject);

            expect(mockModel.find).toHaveBeenCalledWith(queryObject);
            expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockQuery.limit).toHaveBeenCalledWith(1);
            expect(result).toEqual(lastItem);
        });
    });

    describe("update", () => {
        it("should update a document by ID", async () => {
            const documentId = "123456789";
            const updateSet = { name: "updated name" };
            const updatedDoc = { _id: documentId, ...updateSet };
            mockModel.update.mockResolvedValue(updatedDoc);

            const result = await service.update(documentId, updateSet);

            expect(mockModel.update).toHaveBeenCalledWith(documentId, updateSet, { upsert: true });
            expect(result).toEqual(updatedDoc);
        });
    });
});