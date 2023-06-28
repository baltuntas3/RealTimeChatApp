const { getValueRedis, setValueRedis, updateExistKey } = require("../configs/RedisConnection");
const jwt = require("jsonwebtoken");
// const { errorHandler, catchErrors } = require("../middlewares/ErrorHandler");
const AuthException = require("../exceptions/AuthException");
require("dotenv").config();
const { ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME, COOKIE_EXPIRE_TIME } = process.env;

const verifyToken = async (req, res, next) => {
    try {
        const token =
            (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]) || req.cookies.accessToken;
        const user = jwt.verify(token, ACCESS_SECRET_KEY);
        req.user = user;
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            const token =
                (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]) || req.cookies.accessToken;
            const { id: userId } = jwt.decode(token);
            const refreshToken = await getValueRedis(userId);

            if (!refreshToken) return next(new AuthException("Invalid Token: " + err.message));

            const refreshUser = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
            const newAccessToken = jwt.sign({ username: refreshUser.username, id: refreshUser.id }, ACCESS_SECRET_KEY, {
                expiresIn: TOKEN_EXPIRE_TIME,
            });
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                // maxAge: COOKIE_EXPIRE_TIME,
            });
            req.user = refreshUser;

            return next();
        }
        return next(new AuthException("Something went wrong!"));
    }
};

module.exports = verifyToken;
