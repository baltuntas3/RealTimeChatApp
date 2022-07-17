const express = require('express')
const router = express.Router()
const MessageService = require('../services/Messages')
const verifyToken= require('../middlewares/Auth')


router.post('/send', verifyToken, async (req, res) => {
    const {groupId,senderId,message}=req.body

    const sendMessage = await MessageService.add({
        messageGroupId:groupId,
        sender:senderId,
        message:message
    })

    res.json(sendMessage)

})

router.get('/:groupId', verifyToken, async (req, res) => {
    const {groupId}=req.params

    const findAllMessages = await MessageService.query({
        messageGroupId:groupId
    })
    res.json(findAllMessages)

})



module.exports = router