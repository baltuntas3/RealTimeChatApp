const MessageService = require("../../services/MessageService");
const MessageModel = require("../../models/Messages");

jest.mock("../../models/Messages");

describe("MessageService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("sendMessage", () => {
        it("should send a message and return the created message", async () => {
            const groupId = "group123";
            const senderId = "user123";
            const message = "Hello world";
            const mockMessage = {
                _id: "msg123",
                messageGroupId: groupId,
                sender: senderId,
                message: message
            };

            MessageModel.create.mockResolvedValue(mockMessage);

            const result = await MessageService.sendMessage(groupId, senderId, message);

            expect(MessageModel.create).toHaveBeenCalledWith({
                messageGroupId: groupId,
                sender: senderId,
                message: message
            });
            expect(result).toEqual(mockMessage);
        });
    });

    describe("findAllMessages", () => {
        it("should find all messages in a group", async () => {
            const groupId = "group123";
            const mockMessages = [
                { messageGroupId: groupId, message: "Hello" },
                { messageGroupId: groupId, message: "World" }
            ];

            MessageModel.find.mockResolvedValue(mockMessages);

            const result = await MessageService.findAllMessages(groupId);

            expect(MessageModel.find).toHaveBeenCalledWith({ messageGroupId: groupId }, undefined);
            expect(result).toEqual(mockMessages);
        });

        it("should return empty array when no messages found", async () => {
            const groupId = "group123";

            MessageModel.find.mockResolvedValue([]);

            const result = await MessageService.findAllMessages(groupId);

            expect(MessageModel.find).toHaveBeenCalledWith({ messageGroupId: groupId }, undefined);
            expect(result).toEqual([]);
        });
    });

    describe("getLastMessageInGroup", () => {
        it("should get the last message in a group", async () => {
            const groupId = "group123";
            const mockLastMessage = [{ messageGroupId: groupId, message: "Latest message" }];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockLastMessage)
            };

            MessageModel.find.mockReturnValue(mockQuery);

            const result = await MessageService.getLastMessageInGroup(groupId);

            expect(MessageModel.find).toHaveBeenCalledWith({ messageGroupId: groupId });
            expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockQuery.limit).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockLastMessage);
        });
    });

    describe("getMessagesPagination", () => {
        it("should get paginated messages", async () => {
            const groupId = "group123";
            const pageNumber = 2;
            const nPerPage = 5;
            const mockMessages = [
                { messageGroupId: groupId, message: "Message 1" },
                { messageGroupId: groupId, message: "Message 2" }
            ];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockMessages)
            };

            MessageModel.find.mockReturnValue(mockQuery);

            const result = await MessageService.getMessagesPagination(groupId, pageNumber, nPerPage);

            expect(MessageModel.find).toHaveBeenCalledWith({ messageGroupId: groupId }, undefined);
            expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockQuery.skip).toHaveBeenCalledWith(5);
            expect(mockQuery.limit).toHaveBeenCalledWith(5);
            expect(result).toEqual(mockMessages);
        });

        it("should handle first page correctly", async () => {
            const groupId = "group123";
            const pageNumber = 1;
            const nPerPage = 10;
            const mockMessages = [{ messageGroupId: groupId, message: "Message 1" }];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockMessages)
            };

            MessageModel.find.mockReturnValue(mockQuery);

            const result = await MessageService.getMessagesPagination(groupId, pageNumber, nPerPage);

            expect(mockQuery.skip).toHaveBeenCalledWith(0);
            expect(mockQuery.limit).toHaveBeenCalledWith(10);
            expect(result).toEqual(mockMessages);
        });
    });
});