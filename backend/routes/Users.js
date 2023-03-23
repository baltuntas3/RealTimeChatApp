const express = require("express");
const router = express.Router();
const { UserService } = require("../services/AllServices");
const jwtHelper = require("../helpers/JwtHelper");
const errorMessage = require("../helpers/ErrorHandling");
const successMessage = require("../helpers/SuccessMessageBuilder");

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
        const userInformation = { username: req.body.username, password: req.body.password };
        const user = await UserService.findByUserName(userInformation.username);

        if (user) {
            const pass = jwtHelper.bcryptPasswordChecker(userInformation.password, user.password); //true or false
            if (pass) {
                const accessToken = jwtHelper.generateJwtToken({ username: user.userName, id: user._id });
                const refreshToken = jwtHelper.generateRefreshJwtToken({ username: user.userName, id: user._id });
                req.user = user;
                res.cookie("token", accessToken, { httpOnly: true });
                res.cookie("refreshToken", refreshToken, { httpOnly: true });
                return res.status(200).send({ accessToken, refreshToken });
            } else {
                return res.status(401).send(errorMessage("Bilgiler yanlış.."));
            }
        }
        return res.status(401).send(errorMessage("Bilgiler yanlış.."));
    } catch (e) {
        return res.status(500).send(errorMessage(e.message));
    }
});

// router.get("/send-request/:userId", verifyToken, async (req, res) => {
//     const { id } = req.user;
//     const { userId } = req.params;
//     const checkRequest = await NotificationService.queryOne({
//         fromUser: id,
//         toUser: userId,
//     });

//     if (id !== userId && !checkRequest) {
//         const userToSend = await UserService.find(userId);
//         console.log(userToSend);
//         if (userToSend && !userToSend.friends.includes(id)) {
//             //gönderilecek adam varsa ve arkadaşım değilse
//             const addRequest = await NotificationService.sendFriendRequest(id, userId);
//             console.log(addRequest);
//             return res.send(addRequest);
//         }
//     }

//     res.send(errorMessage("Hata."));
// });

// router.get("/denem", verifyToken, async (req, res) => {

//     res.send(errorMessage("Hata."));
// });

//Gelen kutusu yap istekleri çek onaylarsa ekle
// const userLoggedIn = await UserService.find(id)
// userLoggedIn.friends.push(userToSend._id)

// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const { ACCESS_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, TOKEN_EXPIRE_TIME } = process.env;

// router.get("/refresh-verify-token", async (req, res, next) => {
//     try {
//         const authHeader = req.headers["authorization"];
//         const refreshToken = (authHeader && authHeader.split(" ")[1]) || req.cookies.refreshToken;
//         if (refreshToken) {
//             const refreshUser = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
//             const newAccessToken = jwt.sign({ username: refreshUser.username, id: refreshUser.id }, ACCESS_SECRET_KEY, {
//                 expiresIn: `${TOKEN_EXPIRE_TIME}`,
//             });

//             res.cookie("token", newAccessToken, { httpOnly: true });
//             req.user = jwt.verify(newAccessToken, ACCESS_SECRET_KEY);
//             return res.status(200).send(errorMessage("Invalid Token: "));
//         }
//     } catch (err) {
//         return res.status(401).send(errorMessage("Invalid Token: " + err.message));
//     }
// });
module.exports = router;
