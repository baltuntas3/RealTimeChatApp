const Service = require("./Service");
const UserModel = require("../models/Users");

class UserService extends Service {
    model = UserModel;

    /**
     * Finds a user by their username.
     *
     * @param {string} username - The username to search for.
     * @returns {Promise<Object>} - A promise that resolves to the user object with the matching username.
     */
    async findByUsername(username) {
        return this.findOneBy({userName: username});
    }

    /**
     * Finds all users with pagination.
     *
     * @param {number} page - The page number (default: 1).
     * @param {number} limit - The number of users per page (default: 10).
     * @returns {Promise<Array<Object>>} - A promise that resolves to an array of user objects, excluding the password field.
     */
    async findAllUsers(page = 1, limit = 10) {
        return this.queryPagination({}, page, limit, {createdAt: -1}, "-password");
    }
}

module.exports = new UserService();
