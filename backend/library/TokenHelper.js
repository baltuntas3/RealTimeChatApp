const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const {ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME} = process.env;
class TokenHelper {
    signKey(token, secret, expireTime) {
        return promisify(jwt.sign)(token, secret, {expiresIn: expireTime});
    }

    generateAccessToken(token) {
        return this.signKey(token, ACCESS_SECRET_KEY, TOKEN_EXPIRE_TIME);
    }

    generateRefreshToken(token) {
        return this.signKey(token, REFRESH_TOKEN_SECRET_KEY, REFRESH_TOKEN_EXPIRE_TIME);
    }

    verifyRefreshToken(token) {
        return this.verifyTokenAsync(token, REFRESH_TOKEN_SECRET_KEY);
    }

    verifyTokenAsync(token, secret) {
        return promisify(jwt.verify)(token, secret);
    }

    verifyAccessToken(token) {
        return this.verifyTokenAsync(token, ACCESS_SECRET_KEY);
    }
}

module.exports = new TokenHelper();
