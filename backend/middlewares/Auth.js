const jwt = require("jsonwebtoken");
const errorMessage = require("../helpers/ErrorHandling");
require("dotenv").config();
const { ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME } = process.env;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    try {
        const token = (authHeader && authHeader.split(" ")[1]) || req.cookies.token;

        if (!token) {
            return res.status(401).send(errorMessage("Token must provided"));
        }
        const user = jwt.verify(token, ACCESS_SECRET_KEY);
        // console.log("Giriyorum....");
        req.user = user;
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            const refreshToken = (authHeader && authHeader.split(" ")[1]) || req.cookies.refreshToken;
            if (!refreshToken) return res.status(401).send(errorMessage("Invalid Token: " + err.message));
            const refreshUser = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
            const newAccessToken = jwt.sign({ username: refreshUser.username, id: refreshUser.id }, ACCESS_SECRET_KEY, {
                expiresIn: `${TOKEN_EXPIRE_TIME}`,
            });
            if (!refreshUser) return res.status(401).send(errorMessage("Invalid Token: " + err.message));
            req.user = refreshUser;
            res.cookie("token", newAccessToken, { httpOnly: true });
            return next();
            // req.user = jwt.verify(newAccessToken, ACCESS_SECRET_KEY);
            // return res.status(401).send(errorMessage("Invalid Token: " + err.message));
        }
    }
};

module.exports = verifyToken;
