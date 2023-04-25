const { getValueRedis, setValueRedis, updateExistKey, delKeyRedis } = require("../configs/RedisConnection");
const jwt = require("jsonwebtoken");
const errorMessage = require("../helpers/ErrorHandling");
require("dotenv").config();
const { ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME, COOKIE_EXPIRE_TIME } = process.env;

const verifyToken = async (req, res, next) => {
    try {
        const token = (req.headers["Authorization"] && req.headers["Authorization"].split(" ")[1]) || req.cookies.token;

        if (!token) return res.status(401).send(errorMessage("Token must provided"));

        const user = jwt.verify(token, ACCESS_SECRET_KEY);
        req.user = user;
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            const token =
                (req.headers["Authorization"] && req.headers["Authorization"].split(" ")[1]) || req.cookies.token;
            const refreshToken = await getValueRedis(token);

            if (!refreshToken) return res.status(401).send(errorMessage("Invalid Token: " + err.message));

            // acquire a lock for the token key
            const lockKey = token;
            const lockValue = refreshToken;
            await setValueRedis(lockKey, lockValue, "NX", "EX", 60);

            // if (!acquiredLock) {
            //     // lock was not acquired, another request is already updating the key
            //     // wait a bit and try again
            //     await new Promise((resolve) => setTimeout(resolve, 100));
            //     return verifyToken(req, res, next);
            // }

            const refreshUser = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
            const newAccessToken = jwt.sign({ username: refreshUser.username, id: refreshUser.id }, ACCESS_SECRET_KEY, {
                expiresIn: `${TOKEN_EXPIRE_TIME}`,
            });
            await updateExistKey(token, newAccessToken);
            res.cookie("token", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                // maxAge: COOKIE_EXPIRE_TIME,
            });
            req.user = refreshUser;

            // release the lock for the token key
            // const currentLockValue = await getValueRedis(lockKey);
            // if (currentLockValue && currentLockValue === lockValue) {
            //     // lock still has the same value, it was not modified by another request
            //     await delKeyRedis(lockKey);
            // }

            // res.clearCookie("token");
            return next();
        }
        return res.status(401).send(errorMessage("Something went wrong!"));
    }
};

module.exports = verifyToken;
