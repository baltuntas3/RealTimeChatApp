const express = require("express");
const router = express.Router();
const {MessageGroupService} = require("../services/AllServices");
const {asyncHandler} = require("../middlewares/ErrorHandler");

router.post(
    "/send",
    asyncHandler(async (req, res) => {
        const {groupId, senderId, message} = req.body;
        const sendMessage = await MessageGroupService.addMessageToGroup(groupId, senderId, message);

        res.status(200).json({ success: true, data: sendMessage });
    })
);

router.get(
    "/group-messages/:groupId",
    asyncHandler(async (req, res) => {
        const {groupId} = req.params;

        const findAllMessages = await MessageGroupService.getAllMessagesInGroup(groupId);
        res.status(200).json({ success: true, data: findAllMessages });
    })
);

router.get(
    "/inbox",
    asyncHandler(async (req, res) => {
        const {_id} = req.user;
        const userInbox = await MessageGroupService.listMyChatGroupsWithLastMessage(_id);
        res.status(200).json({ success: true, data: userInbox });
    })
);

router.get(
    "/get-last-message/:groupId",
    asyncHandler(async (req, res) => {
        const {groupId} = req.params;
        const lastMessage = await MessageGroupService.getLastMessageInGroup(groupId);
        res.status(200).json({ success: true, data: lastMessage });
    })
);

router.post(
    "/group-messages-pagination",
    asyncHandler(async (req, res) => {
        const {groupId, pageNumber, nPerPage} = req.body;

        const result = await MessageGroupService.getGroupWithMessages(groupId, pageNumber, nPerPage);
        res.status(200).json({ success: true, data: result });
    })
);

module.exports = router;
