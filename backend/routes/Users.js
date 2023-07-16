const express = require("express");
const router = express.Router();
const { UserService } = require("../services/AllServices");
const JwtHelper = require("../helpers/JwtHelper");
const successMessage = require("../helpers/SuccessMessageBuilder");
const { setValueRedis } = require("../configs/RedisConnection");
const verifyToken = require("../middlewares/Auth");
const AuthException = require("../exceptions/AuthException");
const { catchErrors } = require("../middlewares/ErrorHandler");

require("dotenv").config();

router.get("/logout", verifyToken, (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.json(successMessage(res.locals.t("logOut")));
});

//User Profile
router.get(
    "profile/:id",
    catchErrors(async (req, res) => {
        const { id } = req.params;
        const user = await UserService.find(id, "-password");
        res.send(user);
    })
);

router.post(
    "/sign-in",
    catchErrors(async (req, res, next) => {
        const user = await UserService.signIn(req.body);
        res.send(user);
    })
);

router.post(
    "/login",
    catchErrors(async (req, res, next) => {
        // const { COOKIE_EXPIRE_TIME } = process.env;
        const userInformation = { username: req.body.username, password: req.body.password };
        const user = await UserService.findByUsername(userInformation.username);

        if (user) {
            const pass = await JwtHelper.bcryptPasswordChecker(userInformation.password, user.password); //true or false
            if (pass) {
                const accessToken = JwtHelper.generateJwtToken({ username: user.userName, id: user._id });
                const refreshToken = JwtHelper.generateRefreshJwtToken({ username: user.userName, id: user._id });
                req.user = user;
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                await setValueRedis(req.user.id, refreshToken);
                return res.status(200).send({ accessToken });
            } else {
                return next(new AuthException(res.locals.t("userPass")));
            }
        }
        return next(new AuthException(res.locals.t("userPass")));
    })
);

router.get("/get-user-info", verifyToken, (req, res, next) => {
    if (req.user) return res.send(req.user);
    return next(new AuthException(res.locals.t("authException")));
});

router.get(
    "/get-all-users",
    verifyToken,
    catchErrors(async (req, res) => {
        const user = await UserService.findAllUsers();
        res.send(user);
    })
);

module.exports = router;
