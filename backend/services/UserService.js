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
     * Finds all users.
     *
     * @returns {Promise<Array<Object>>} - A promise that resolves to an array of all user objects, excluding the password field.
     */
    async findAllUsers() {
        return this.findAll("-password");
    }
}

module.exports = new UserService();
