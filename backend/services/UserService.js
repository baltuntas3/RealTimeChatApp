const Service = require("./Service");
const UserModel = require("../models/Users");

class UserService extends Service {
    model = UserModel;

    async findByUsername(username) {
        return this.findOneBy({userName: username});
    }

    async findAllUsers() {
        return this.findAll("-password");
    }
}

module.exports = new UserService();
