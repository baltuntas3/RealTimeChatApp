const Service = require("./Service");
const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");

class UserService extends Service {
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

    async findByUsername(username) {
        return await this.findOneBy({ userName: username });
    }

    async findAllUsers() {
        return await this.findAll("-password");
    }
}

module.exports = new UserService();
