const express = require("express");
const router = express.Router();
const {AuthenticationService} = require("../services/AllServices");
const verifyToken = require("../middlewares/Auth");
const AuthException = require("../exceptions/AuthException");
const {catchErrors} = require("../middlewares/ErrorHandler");
const TokenHelper = require("../library/TokenHelper");

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).send(res.locals.t("logOut"));
});

router.post(
    "/sign-in",
    catchErrors(async (req, res, next) => {
        const user = await AuthenticationService.signIn(req.body);
        res.sendStatus(200);
    })
);

router.post(
    "/login",
    catchErrors(async (req, res, next) => {
        const userInformation = {username: req.body.username, password: req.body.password};

        const user = await AuthenticationService.login(userInformation);
        const tokens = await AuthenticationService.setTokens(user);

        if (tokens) {
            const {accessToken, refreshToken} = tokens;
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            return res.send({accessToken});
        }

        return next(new AuthException(res.locals.t("userPass")));
    })
);

router.get(
    "/refresh-token",
    catchErrors(async (req, res, next) => {
        try {
            const refreshToken =
                (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]) ||
                req.cookies.refreshToken;
            if (!refreshToken) return next("Invalid Token: " + err.message);

            const userInformation = await TokenHelper.verifyRefreshToken(refreshToken);
            const tokens = await AuthenticationService.setTokens(userInformation);

            if (tokens) {
                const {accessToken, refreshToken} = tokens;
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                return res.sendStatus(200);
            }
        } catch (error) {
            return next(new Error("Something went wrong!"));
        }
    })
);

router.get("/get-user-info", verifyToken, (req, res, next) => {
    if (req.user) return res.send(req.user);
    return next(new AuthException(res.locals.t("authException")));
});

module.exports = router;
