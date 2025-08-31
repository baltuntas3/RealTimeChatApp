module.exports = {
    testEnvironment: "node",
    preset: "@shelf/jest-mongodb",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
