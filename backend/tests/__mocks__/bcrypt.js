const bcrypt = jest.createMockFromModule("bcrypt");
jest.spyOn(bcrypt, "hash").mockImplementation((a) => a);
module.exports = bcrypt;
