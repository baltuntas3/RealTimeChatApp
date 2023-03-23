const BaseService = require("./BaseService");
const UserModel = require("../models/Users");

const bcrypt = require("bcrypt");
class UserService extends BaseService {
    model = UserModel;

    async signIn(userInformation) {
        console.log(userInformation);

        const hashedPassword = await bcrypt.hash(userInformation.password, 10);
        // const pass= await bcrypt.compare(userInformation.password,hashedPassword)
        try {
            return await this.add({
                userName: userInformation.username,
                password: hashedPassword,
                email: userInformation.email,
                age: userInformation.age,
            });
        } catch (err) {
            return this.handleError(err.message);
        }
    }
}

module.exports = new UserService();
