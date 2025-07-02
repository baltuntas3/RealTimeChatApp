const express = require("express");
const router = express.Router();
const {MessageService, MessageGroupService} = require("../services/AllServices");
const {asyncHandler} = require("../middlewares/ErrorHandler");

router.post(
    "/send",
    asyncHandler(async (req, res) => {
        const {groupId, senderId, message} = req.body;
        const sendMessage = await MessageService.add({
            messageGroupId: groupId,
            sender: senderId,
            message: message,
        });

        res.status(200).json({ success: true, data: sendMessage });
    })
);

router.get(
    "/group-messages/:groupId",
    asyncHandler(async (req, res) => {
        const {groupId} = req.params;

        const findAllMessages = await MessageService.findAllMessages(groupId);
        res.status(200).json({ success: true, data: findAllMessages });
    })
);

router.get(
    "/inbox",
    asyncHandler(async (req, res) => {
        const {_id} = req.user;
        const userInbox = await MessageGroupService.listMyChatGroups(_id);
        res.status(200).json({ success: true, data: userInbox });
    })
);

router.get(
    "/get-last-message/:groupId",
    asyncHandler(async (req, res) => {
        const {groupId} = req.params;
        const [lastMessage] = await MessageService.getLastMessageInGroup(groupId);
        res.status(200).json({ success: true, data: lastMessage });
    })
);

router.post(
    "/group-messages-pagination",

    asyncHandler(async (req, res) => {
        const {groupId, pageNumber, nPerPage} = req.body;

        const findAllMessages = await MessageService.getMessagesPagination(groupId, pageNumber, nPerPage);
        res.status(200).json({ success: true, data: findAllMessages });
    })
);

module.exports = router;
