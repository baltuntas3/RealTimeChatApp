const UserService = require("../../services/UserService");
const UserModel = require("../../models/Users");

jest.mock("../../models/Users");

describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findByUsername", () => {
        it("should find a user by username", async () => {
            const mockUser = { userName: "testuser", email: "test@example.com" };
            UserModel.findOne.mockResolvedValue(mockUser);

            const result = await UserService.findByUsername("testuser");

            expect(UserModel.findOne).toHaveBeenCalledWith({ userName: "testuser" }, undefined);
            expect(result).toEqual(mockUser);
        });

        it("should return null if user not found", async () => {
            UserModel.findOne.mockResolvedValue(null);

            const result = await UserService.findByUsername("nonexistent");

            expect(UserModel.findOne).toHaveBeenCalledWith({ userName: "nonexistent" }, undefined);
            expect(result).toBeNull();
        });
    });

    describe("findAllUsers", () => {
        it("should return paginated users with default parameters", async () => {
            const mockUsers = [
                { userName: "user1", email: "user1@example.com" },
                { userName: "user2", email: "user2@example.com" }
            ];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockUsers)
            };

            UserModel.find.mockReturnValue(mockQuery);

            const result = await UserService.findAllUsers();

            expect(UserModel.find).toHaveBeenCalledWith({}, "-password");
            expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockQuery.skip).toHaveBeenCalledWith(0);
            expect(mockQuery.limit).toHaveBeenCalledWith(10);
            expect(result).toEqual(mockUsers);
        });

        it("should return paginated users with custom parameters", async () => {
            const mockUsers = [{ userName: "user1", email: "user1@example.com" }];

            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockUsers)
            };

            UserModel.find.mockReturnValue(mockQuery);

            const result = await UserService.findAllUsers(2, 5);

            expect(UserModel.find).toHaveBeenCalledWith({}, "-password");
            expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockQuery.skip).toHaveBeenCalledWith(5);
            expect(mockQuery.limit).toHaveBeenCalledWith(5);
            expect(result).toEqual(mockUsers);
        });
    });
});