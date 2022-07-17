const BaseService = require('./BaseService')
const MessageModel = require('../models/Messages')

class MessageService extends BaseService {
    model = MessageModel

    // socketId:{
    //     type:String
    // },
    // participants: [{
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'User'
    // }],
    // messages:[{
    //     sender:{
    //         type: mongoose.SchemaTypes.ObjectId,
    //         ref: 'User'
    //     },
    //     message: {
    //         type:String
    //     },
        
    // }
    // console.log(isThereRoom)
    // console.log(loggedInUser,message,room)
    async sendPrivateMessage(loggedInUser,message,room){
        // i must search with loggedInUser and message.userSender
        const isThereRoom= await this.getSocket(room)
        if(!isThereRoom){
            return await this.add({
                socketId:room,
                participants: [loggedInUser,message.userSender],
                messages:[{
                    sender:message.userSender,
                    message:message.message
                }]
            })
        }else{
            // isThereRoom kayıt gelmiştir
            console.log("kayıt bulundu.")
        }
    }

    async getSocket(socketIdentity){
        try {
            const isSocketExist = await this.queryOne({socketId:socketIdentity})
            if(!isSocketExist){
                return false
            }
            return isSocketExist
            
        } catch (error) {
            return error.message
        }
    }

    async findRoom(loggedInUser,userToSend){
        try {
            const isThereRoom = await this.queryOne({
                
            })
        } catch (error) {
            return error.message
        }

    }
    

}

module.exports = new MessageService()
