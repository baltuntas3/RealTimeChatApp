const BaseService = require('./BaseService')
const NotificationModel = require('../models/Notifications')

class NotificationService extends BaseService {
    model = NotificationModel

    async sendFriendRequest(from,to){
        return await this.add({
                fromUser:from,
                toUser:to,
                type:"FRIEND",
                message:"Beni arkadaşın olarak ekler misin?",
                isApproved:0,
                isSeen:0
            })
    }

}


module.exports = new NotificationService()