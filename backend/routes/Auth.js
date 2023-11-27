const express = require("express");
const router = express.Router();
const {AuthenticationService} = require("../services/AllServices");
const verifyToken = require("../middlewares/Auth");
const {catchErrors} = require("../middlewares/ErrorHandler");
const TokenHelper = require("../library/TokenHelper");
const CookieGenerator = require("../library/CookieGenerator");
const refreshTokenBlackList = require("../library/RefreshTokenBlackList");
const ForbiddenException = require("../exceptions/ForbiddenException");

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).send(res.locals.t("logOut"));
});

router.post(
    "/sign-in",
    catchErrors(async (req, res, next) => {
        await AuthenticationService.signIn(req.body);
        res.sendStatus(200);
    })
);

router.post("/login", async (req, res, next) => {
    try {
        const userInformation = {username: req.body.username, password: req.body.password};

        const user = await AuthenticationService.login(userInformation);
        const tokens = await AuthenticationService.generateAccessAndRefreshTokensFromUser(user);
        CookieGenerator.generateAccessAndRefreshTokenCookie(res, tokens);

        return res.send(tokens);
    } catch (error) {
        return next(new Error(res.locals.t("userPass")));
    }
});

router.get(
    "/refresh-token",
    catchErrors(async (req, res, next) => {
        const refreshToken =
            (req.headers["Authorization"] && req.headers["Authorization"].split(" ")[1]) || req.cookies.refreshToken;
        if (!refreshToken) return next(new ForbiddenException("Invalid Token!"));
        if (refreshTokenBlackList.isBlacklisted(refreshToken)) return next(new ForbiddenException("Invalid Token!"));

        const userInformation = await TokenHelper.verifyRefreshToken(refreshToken);
        refreshTokenBlackList.addToBlacklist(refreshToken);
        const tokens = await AuthenticationService.generateAccessAndRefreshTokensFromUser(userInformation);
        CookieGenerator.generateAccessAndRefreshTokenCookie(res, tokens);
        return res.sendStatus(200);
    })
);

router.get("/get-user-info", verifyToken, (req, res, next) => {
    return res.send(req.user);
});

module.exports = router;
