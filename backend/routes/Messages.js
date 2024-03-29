const express = require("express");
const router = express.Router();
const {MessageService, MessageGroupService} = require("../services/AllServices");
const {catchErrors} = require("../middlewares/ErrorHandler");

router.post(
    "/send",
    catchErrors(async (req, res) => {
        const {groupId, senderId, message} = req.body;
        const sendMessage = await MessageService.add({
            messageGroupId: groupId,
            sender: senderId,
            message: message,
        });

        res.json(sendMessage);
    })
);

router.get(
    "/group-messages/:groupId",
    catchErrors(async (req, res) => {
        const {groupId} = req.params;

        const findAllMessages = await MessageService.findAllMessages(groupId);
        res.json(findAllMessages);
    })
);

router.get(
    "/inbox",
    catchErrors(async (req, res) => {
        const {_id} = req.user;
        const userInbox = await MessageGroupService.listMyChatGroups(_id);
        res.json(userInbox);
    })
);

router.get(
    "/get-last-message/:groupId",
    catchErrors(async (req, res) => {
        const {groupId} = req.params;
        const [lastMessage] = await MessageService.getLastMessageInGroup(groupId);
        res.json(lastMessage);
    })
);

router.post(
    "/group-messages-pagination",

    catchErrors(async (req, res) => {
        const {groupId, pageNumber, nPerPage} = req.body;

        const findAllMessages = await MessageService.getMessagesPagination(groupId, pageNumber, nPerPage);
        res.json(findAllMessages);
    })
);

module.exports = router;
