const express = require("express");
const router = express.Router();

const { MessageGroupService } = require("../services/AllServices");

const verifyToken = require("../middlewares/Auth");

router.post("/add-group", verifyToken, async (req, res) => {
    const loggedInUserId = req.user.id;
    const { participants } = req.body;
    participants.push(loggedInUserId);
    console.log(participants);
    const group = await MessageGroupService.addGroup(participants);
    res.send(group);
});

module.exports = router;
