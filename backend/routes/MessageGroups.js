const express = require("express");
const { catchErrors } = require("../middlewares/ErrorHandler");
const router = express.Router();
const verifyToken = require("../middlewares/Auth");
const { MessageGroupService } = require("../services/AllServices");

router.post(
    "/add-group",
    verifyToken,
    catchErrors(async (req, res) => {
        const loggedInUserId = req.user.id;
        const { participants } = req.body;
        participants.push(loggedInUserId);
        console.log(participants);
        const group = await MessageGroupService.addGroup(participants);
        res.send(group);
    })
);

module.exports = router;
