const BaseService = require('./BaseService')
const MessageGroupsModel = require('../models/MessageGroups')

class MessageGroupsService extends BaseService {
    model = MessageGroupsModel


    async addGroup(senderId,receiverId){
        try {
            return await this.add({
                participants:[senderId,receiverId]
            })
        } catch (error) {
            return error.message
        }
    }

}


module.exports = new MessageGroupsService()