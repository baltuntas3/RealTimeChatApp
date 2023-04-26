const express = require("express");
const router = express.Router();
const { UserService } = require("../services/AllServices");
const jwtHelper = require("../helpers/JwtHelper");
const errorMessage = require("../helpers/ErrorHandling");
const successMessage = require("../helpers/SuccessMessageBuilder");
const { setValueRedis } = require("../configs/RedisConnection");
const verifyToken = require("../middlewares/Auth");
require("dotenv").config();

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.json(successMessage("Başarılı bir şekilde çıkış yapıldı."));
});

//User Profile
router.get("profile/:id", async (req, res) => {
    const { id } = req.params;
    const user = await UserService.find(id);
    res.send(user);
});

router.post("/sign-in", async (req, res) => {
    console.log("reg body", req.body);
    const user = await UserService.signIn(req.body);
    res.send(user);
});

router.post("/login", async (req, res) => {
    try {
        const { COOKIE_EXPIRE_TIME } = process.env;
        const userInformation = { username: req.body.username, password: req.body.password };
        const user = await UserService.findByUserName(userInformation.username);

        if (user) {
            const pass = jwtHelper.bcryptPasswordChecker(userInformation.password, user.password); //true or false
            if (pass) {
                const accessToken = jwtHelper.generateJwtToken({ username: user.userName, id: user._id });
                const refreshToken = jwtHelper.generateRefreshJwtToken({ username: user.userName, id: user._id });
                req.user = user;
                res.cookie("token", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    // maxAge: COOKIE_EXPIRE_TIME,
                });
                // TODO: use redis to store refresh token
                console.log(typeof req.user.id, req.user);
                await setValueRedis(req.user.id, refreshToken);
                console.log(req.user.id, "**");

                return res.status(200).send({ accessToken });
            } else {
                return res.status(401).send(errorMessage("Bilgiler yanlış.."));
            }
        }
        return res.status(401).send(errorMessage("Bilgiler yanlış.."));
    } catch (e) {
        return res.status(500).send(errorMessage(e.message));
    }
});

router.get("/get-user-info", verifyToken, (req, res) => {
    // const { id } = req.params;
    // const user = await UserService.find(id);
    req.user ? res.send(req.user) : res.send("I am a teapot!");
});

module.exports = router;
