const jwt = require("jsonwebtoken");
const {ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME} = process.env;

class TokenHelper {
    promiseSign(payload, secret, expireTime) {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secret, {expiresIn: expireTime}, function (err, token) {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    generateAccessToken(payload) {
        return this.promiseSign(payload, ACCESS_SECRET_KEY, TOKEN_EXPIRE_TIME);
    }

    generateRefreshToken(payload) {
        return this.promiseSign(payload, REFRESH_TOKEN_SECRET_KEY, REFRESH_TOKEN_EXPIRE_TIME);
    }

    verifyRefreshToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, REFRESH_TOKEN_SECRET_KEY, function (err, token) {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    verifyAccessToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, ACCESS_SECRET_KEY, function (err, token) {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    // decodeToken(token){
    //     return new Promise((resolve, reject) => {
    //         jwt.decode(token, secret, function (err, token) {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(token);
    //             }
    //         });
    //     });
    // }
}

module.exports = new TokenHelper();
