const express = require("express");
const router = express.Router();
const { MessageService, MessageGroupService } = require("../services/AllServices");
const verifyToken = require("../middlewares/Auth");

router.post("/send", verifyToken, async (req, res) => {
    const { groupId, senderId, message } = req.body;
    const sendMessage = await MessageService.add({
        messageGroupId: groupId,
        sender: senderId,
        message: message,
    });

    res.json(sendMessage);
});

router.get("/group-messages/:groupId", verifyToken, async (req, res) => {
    const { groupId } = req.params;

    const findAllMessages = await MessageService.findAllMessages(groupId);
    res.json(findAllMessages);
});

router.get("/inbox", verifyToken, async (req, res) => {
    const { id } = req.user;
    console.log(id, "--1");
    const userInbox = await MessageGroupService.listMyChatGroups(id);
    res.json(userInbox);
});

router.get("/get-last-message/:groupId", verifyToken, async (req, res) => {
    const { groupId } = req.params;
    const lastMessage = await MessageService.getLastMessageInGroup(groupId);
    res.json(lastMessage);
});

module.exports = router;
