const express = require("express");
const router = express.Router();
const {UserService} = require("../services/AllServices");
const RoleAuth = require("../middlewares/RoleAuth");
const {asyncHandler} = require("../middlewares/ErrorHandler");

router.get(
    "profile/:id",
    asyncHandler(async (req, res) => {
        const {id} = req.params;
        const user = await UserService.find(id, "-password");
        res.status(200).json({success: true, data: user});
    })
);

router.get(
    "/get-all-users",
    asyncHandler(async (req, res) => {
        const users = await UserService.findAllUsers();
        res.status(200).json({success: true, data: users});
    })
);

module.exports = router;
