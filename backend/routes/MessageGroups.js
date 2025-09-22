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
        const {participants, firstMessage} = req.body;
        participants.push(loggedInUserId);
        logger.debug('Creating message group', { participants, loggedInUserId });
        
        const group = firstMessage 
            ? await MessageGroupService.createGroupWithFirstMessage(participants, firstMessage, loggedInUserId)
            : await MessageGroupService.addGroup(participants);
            
        res.status(200).json({ success: true, data: group });
    })
);

router.get(
    "/my-groups",
    verifyToken,
    asyncHandler(async (req, res) => {
        const {_id} = req.user;
        const groups = await MessageGroupService.listMyChatGroups(_id);
        res.status(200).json({ success: true, data: groups });
    })
);

router.get(
    "/my-groups-with-last-message",
    verifyToken,
    asyncHandler(async (req, res) => {
        const {_id} = req.user;
        const groups = await MessageGroupService.listMyChatGroupsWithLastMessage(_id);
        res.status(200).json({ success: true, data: groups });
    })
);

module.exports = router;
