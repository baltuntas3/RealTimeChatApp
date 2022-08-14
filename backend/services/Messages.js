const BaseService = require('./BaseService')
const MessageModel = require('../models/Messages')

class MessageService extends BaseService {
    model = MessageModel

    // async sendPrivateMessage(loggedInUser,message,room){


    //     // const isThereRoom= await this.getSocket(room)
    //     // if(!isThereRoom){
    //     //     return await this.add({
    //     //         socketId:room,
    //     //         participants: [loggedInUser,message.userSender],
    //     //         messages:[{
    //     //             sender:message.userSender,
    //     //             message:message.message
    //     //         }]
    //     //     })
    //     // }else{
    //     //     // isThereRoom kayıt gelmiştir
    //     //     console.log("kayıt bulundu.")
    //     // }
    // }

    

}

module.exports = new MessageService()
