const express = require("express");
const router = express.Router();
const {UserService} = require("../services/AllServices");
const verifyToken = require("../middlewares/Auth");
const {catchErrors} = require("../middlewares/ErrorHandler");

router.get(
    "profile/:id",
    catchErrors(async (req, res) => {
        const {id} = req.params;
        const user = await UserService.find(id, "-password");
        res.send(user);
    })
);

router.get(
    "/get-all-users",
    verifyToken,
    catchErrors(async (req, res) => {
        const user = await UserService.findAllUsers();
        res.send(user);
    })
);

module.exports = router;
