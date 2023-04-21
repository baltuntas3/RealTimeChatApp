const jwt = require("jsonwebtoken");
const errorMessage = require("../helpers/ErrorHandling");
require("dotenv").config();
const { ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME, COOKIE_EXPIRE_TIME } = process.env;

const verifyToken = (req, res, next) => {
    try {
        const token = (req.headers["Authorization"] && req.headers["Authorization"].split(" ")[1]) || req.cookies.token;

        if (!token) return res.status(401).send(errorMessage("Token must provided"));

        const user = jwt.verify(token, ACCESS_SECRET_KEY);
        req.user = user;
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            const refreshToken =
                (req.headers["Authorization"] && req.headers["Authorization"].split(" ")[1]) ||
                req.cookies.refreshToken;
            if (!refreshToken) return res.status(401).send(errorMessage("Invalid Token: " + err.message));
            const refreshUser = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
            const newAccessToken = jwt.sign({ username: refreshUser.username, id: refreshUser.id }, ACCESS_SECRET_KEY, {
                expiresIn: `${TOKEN_EXPIRE_TIME}`,
            });
            req.user = refreshUser;
            // res.clearCookie("token");
            res.cookie("token", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: COOKIE_EXPIRE_TIME,
            });
            return next();
        }
        return res.status(418).send(errorMessage("Something went wrong!"));
    }
};

module.exports = verifyToken;
