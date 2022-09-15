const express = require('express')
const router = express.Router()
const UserService = require('../services/Users')
const MessageGroupService = require('../services/MessageGroups')
const verifyToken= require('../middlewares/Auth')

router.post('/', verifyToken, async (req, res) => {
    const {senderId,receiverId}=req.body
    const addGroup = await MessageGroupService.addGroup(senderId,receiverId)
    res.json(addGroup)
})


// router.get('/inbox', verifyToken, async (req, res) => {
//     const {id}=req.user
//     const {userId}=req.params
//     const findMyGroups = await MessageGroupService.query({
//         participants:{$in: id}
//     })
//     res.json(findMyGroups)
// })

router.post('/addgroup',verifyToken, async (req,res)=>{
    const {senderId, receiverId} = req.body;
    const group = await MessageGroupService.addGroup(senderId, receiverId)
    res.json(group)
})

//62d361ee869d429482cb80a1

module.exports = router