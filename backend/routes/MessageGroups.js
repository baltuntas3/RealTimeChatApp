const express = require("express");
const {asyncHandler} = require("../middlewares/ErrorHandler");
const router = express.Router();
const verifyToken = require("../middlewares/Auth");
const {MessageGroupService} = require("../services/AllServices");
const logger = require('../configs/Logger');

router.post(
    "/add-group",
    verifyToken,
    asyncHandler(async (req, res) => {
        const loggedInUserId = req.user._id;
        const {participants} = req.body;
        participants.push(loggedInUserId);
        logger.debug('Creating message group', { participants, loggedInUserId });
        const group = await MessageGroupService.addGroup(participants);
        res.status(200).json({ success: true, data: group });
    })
);

module.exports = router;
