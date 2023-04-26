const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const errorMessage = require("../helpers/ErrorHandling");
require("dotenv").config();

class JwtHelper {
    constructor() {
        const { ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME } = process.env;
        this.secret = ACCESS_SECRET_KEY;
        this.refreshSecret = REFRESH_TOKEN_SECRET_KEY;
        this.tokenExpireTime = TOKEN_EXPIRE_TIME;
    }

    generateJwtToken(payload) {
        try {
            const accessToken = jwt.sign(payload, this.secret, { expiresIn: `${this.tokenExpireTime}` });
            return accessToken;
        } catch (error) {
            return errorMessage(error.message);
        }
    }

    generateRefreshJwtToken(payload) {
        try {
            const accessRefreshToken = jwt.sign(payload, this.refreshSecret);
            return accessRefreshToken;
        } catch (error) {
            return errorMessage(error.message);
        }
    }

    bcryptPasswordChecker(formPassword, password) {
        return bcrypt.compareSync(formPassword, password);
    }

    getPayload(token) {
        return jwt.verify(token, this.secret);
    }
}

module.exports = new JwtHelper();
