const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME } = process.env;

class JwtHelper {
    static secret = ACCESS_SECRET_KEY;
    static refreshSecret = REFRESH_TOKEN_SECRET_KEY;
    static tokenExpireTime = TOKEN_EXPIRE_TIME;

    static generateJwtToken(payload) {
        return jwt.sign(payload, this.secret, { expiresIn: `${this.tokenExpireTime}` });
    }

    static generateRefreshJwtToken(payload) {
        return jwt.sign(payload, this.refreshSecret);
    }

    static bcryptPasswordChecker(formPassword, password) {
        return bcrypt.compare(formPassword, password);
    }

    static getPayload(token) {
        return jwt.verify(token, this.secret);
    }
}

module.exports = JwtHelper;
