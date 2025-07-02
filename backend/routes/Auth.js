const express = require("express");
const router = express.Router();
const {AuthenticationService} = require("../services/AllServices");
const verifyToken = require("../middlewares/Auth");
const {asyncHandler} = require("../middlewares/ErrorHandler");
const TokenHelper = require("../library/TokenHelper");
const CookieGenerator = require("../library/CookieGenerator");
const refreshTokenBlackList = require("../library/RefreshTokenBlackList");
const ForbiddenException = require("../exceptions/ForbiddenException");
const AuthException = require("../exceptions/AuthException");

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).send(res.locals.t("logOut"));
});

router.post(
    "/sign-in",
    asyncHandler(async (req, res, next) => {
        await AuthenticationService.signIn(req.body);
        res.status(201).json({ success: true, message: 'User created successfully' });
    })
);

router.post("/login", asyncHandler(async (req, res, next) => {
    const userInformation = {username: req.body.username, password: req.body.password};

    const user = await AuthenticationService.login(userInformation);
    const tokens = await AuthenticationService.generateAccessAndRefreshTokensFromUser(user);
    CookieGenerator.generateAccessAndRefreshTokenCookie(res, tokens);

    return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        ...tokens 
    });
}));

router.get(
    "/refresh-token",
    asyncHandler(async (req, res, next) => {
        const refreshToken = (req.headers["Authorization"] && req.headers["Authorization"].split(" ")[1]) || req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AuthException("No refresh token provided");
        }

        if (refreshTokenBlackList.isBlacklisted(refreshToken)) {
            throw new AuthException("Refresh token is blacklisted");
        }

        const userInformation = await TokenHelper.verifyRefreshToken(refreshToken);
        refreshTokenBlackList.addToBlacklist(refreshToken);
        const tokens = await AuthenticationService.generateAccessAndRefreshTokensFromUser(userInformation);
        CookieGenerator.generateAccessAndRefreshTokenCookie(res, tokens);
        
        return res.status(200).json({ success: true, message: 'Token refreshed successfully' });
    })
);

router.get("/get-user-info", verifyToken, (req, res, next) => {
    return res.status(200).json({ success: true, data: req.user });
});

module.exports = router;
