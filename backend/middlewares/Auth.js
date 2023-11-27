const AuthException = require("../exceptions/AuthException");
const ForbiddenException = require("../exceptions/ForbiddenException");
const tokenHelper = require("../library/TokenHelper");

const verifyToken = async (req, res, next) => {
    try {
        const token =
            (req.headers["Authorization"] && req.headers["Authorization"].split(" ")[1]) || req.cookies.accessToken;
        if (!token) return next(new ForbiddenException("Something went wrong!"));
        const user = await tokenHelper.verifyAccessToken(token);
        req.user = user;
        return next();
    } catch (err) {
        return next(new AuthException("Something went wrong!"));
    }
};

module.exports = verifyToken;
