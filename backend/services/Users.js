const BaseService = require("./BaseService");
const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");

class UserService extends BaseService {
    model = UserModel;

    async signIn(userInformation) {
        const hashedPassword = await bcrypt.hash(userInformation.password, 10);

        return await this.add({
            userName: userInformation.username,
            password: hashedPassword,
            email: userInformation.email,
            age: userInformation.age,
        });
    }
}

module.exports = new UserService();
