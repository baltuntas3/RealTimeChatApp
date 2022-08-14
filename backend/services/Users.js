const BaseService = require('./BaseService')
const UserModel = require('../models/Users')
const {MessageService,MessageGroupService} = require("./AllServices")

const bcrypt = require('bcrypt')
class UserService extends BaseService {
    model = UserModel

    async signIn(userInformation) {
        console.log(userInformation)
    
        const hashedPassword = await bcrypt.hash(userInformation.password, 10)
        // const pass= await bcrypt.compare(userInformation.password,hashedPassword)
        try {
            return await this.add({
                userName:userInformation.username,
                password:hashedPassword,
                email:userInformation.email,
                age:userInformation.age,
            })
            
        } catch (err) {
            return this.handleError(err.message)
        }
    }

    async sendMessage(groupId,senderId,message){
        try {
            const sendMessage = await MessageService.add({
                messageGroupId:groupId,
                sender:senderId,
                message:message
            })

        res.json(sendMessage)
            
        } catch (err) {
            return this.handleError(err.message)
        }
    }


    async findAllMessages(){

    }

    async getUserInbox(userId){
        try {
            console.log(userId)
            const findMyGroups = await MessageGroupService.getUserMessages(userId)
            return findMyGroups
        } catch (err) {
            return this.handleError(err.message)
        }
    }


}

module.exports = new UserService()
