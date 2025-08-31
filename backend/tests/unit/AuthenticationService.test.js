jest.mock("../../services/UserService");
jest.mock("../../library/TokenHelper");
jest.mock("bcrypt");

const AuthenticationService = require("../../services/AuthenticationService");
const UserService = require("../../services/UserService");
const TokenHelper = require("../../library/TokenHelper");
const ForbiddenException = require("../../exceptions/ForbiddenException");
const bcrypt = require("bcrypt");


describe("AuthenticationService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        it("should login user with valid credentials", async () => {
            const userInfo = { username: "testuser", password: "password123" };
            const mockUser = { userName: "testuser", password: "hashedPassword" };

            UserService.findByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            const result = await AuthenticationService.login(userInfo);

            expect(UserService.findByUsername).toHaveBeenCalledWith("testuser");
            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
            expect(result).toEqual(mockUser);
        });

        it("should throw ForbiddenException for invalid credentials", async () => {
            const userInfo = { username: "testuser", password: "wrongpassword" };
            const mockUser = { userName: "testuser", password: "hashedPassword" };

            UserService.findByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const result = await AuthenticationService.login(userInfo);
            expect(result).toBeUndefined();
        });

        it("should throw ForbiddenException when user not found", async () => {
            const userInfo = { username: "nonexistent", password: "password123" };

            UserService.findByUsername.mockResolvedValue(null);

            await expect(AuthenticationService.login(userInfo)).rejects.toThrow(ForbiddenException);
        });
    });

    describe("generateAccessAndRefreshTokensFromUser", () => {
        it("should generate both access and refresh tokens", async () => {
            const userPayload = {
                username: "testuser",
                _id: { toString: () => "123456789" },
                roles: ["client"]
            };

            const mockAccessToken = "access-token";
            const mockRefreshToken = "refresh-token";

            TokenHelper.generateAccessToken.mockResolvedValue(mockAccessToken);
            TokenHelper.generateRefreshToken.mockResolvedValue(mockRefreshToken);

            const result = await AuthenticationService.generateAccessAndRefreshTokensFromUser(userPayload);

            expect(TokenHelper.generateAccessToken).toHaveBeenCalledWith({
                userName: "testuser",
                _id: "123456789",
                roles: ["client"]
            });
            expect(TokenHelper.generateRefreshToken).toHaveBeenCalledWith({
                userName: "testuser",
                _id: "123456789",
                roles: ["client"]
            });
            expect(result).toEqual({
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken
            });
        });
    });

    describe("passwordChecker", () => {
        it("should return true for matching passwords", async () => {
            bcrypt.compare.mockResolvedValue(true);

            const result = await AuthenticationService.passwordChecker("password123", "hashedPassword");

            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
            expect(result).toBe(true);
        });

        it("should return false for non-matching passwords", async () => {
            bcrypt.compare.mockResolvedValue(false);

            const result = await AuthenticationService.passwordChecker("wrongpassword", "hashedPassword");

            expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedPassword");
            expect(result).toBe(false);
        });
    });

    describe("signIn", () => {
        it("should create new user with hashed password and default role", async () => {
            const userInfo = {
                username: "newuser",
                password: "password123",
                email: "test@example.com",
                age: 25
            };

            const hashedPassword = "hashedPassword123";
            const mockCreatedUser = { ...userInfo, password: hashedPassword, roles: ["client"] };

            bcrypt.hash.mockResolvedValue(hashedPassword);
            UserService.add.mockResolvedValue(mockCreatedUser);

            const result = await AuthenticationService.signIn(userInfo);

            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(UserService.add).toHaveBeenCalledWith({
                userName: "newuser",
                password: hashedPassword,
                email: "test@example.com",
                age: 25,
                roles: ["client"]
            });
            expect(result).toEqual(mockCreatedUser);
        });

        it("should create new user with custom roles", async () => {
            const userInfo = {
                username: "adminuser",
                password: "password123",
                email: "admin@example.com",
                age: 30,
                roles: ["admin", "moderator"]
            };

            const hashedPassword = "hashedPassword123";
            const mockCreatedUser = { ...userInfo, password: hashedPassword };

            bcrypt.hash.mockResolvedValue(hashedPassword);
            UserService.add.mockResolvedValue(mockCreatedUser);

            const result = await AuthenticationService.signIn(userInfo);

            expect(UserService.add).toHaveBeenCalledWith({
                userName: "adminuser",
                password: hashedPassword,
                email: "admin@example.com",
                age: 30,
                roles: ["admin", "moderator"]
            });
            expect(result).toEqual(mockCreatedUser);
        });
    });
});