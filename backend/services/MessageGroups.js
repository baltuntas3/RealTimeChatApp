const BaseService = require("./BaseService");
const MessageGroupsModel = require("../models/MessageGroups");

class MessageGroupsService extends BaseService {
    model = MessageGroupsModel;

    async addGroup(senderId, receiverId) {
    
        if (senderId === receiverId) return this.handleError("Kendinize mesaj gönderemezsiniz."); //ileride bunları statik yap.

        try {
            const isThereGroup = await this.query({ participants: { $all: [senderId, receiverId] } });

            if (isThereGroup.length === 0) return await this.add({ participants: [senderId, receiverId] });

            return isThereGroup;
        } catch (error) {
            return this.handleError(error.message);
        }
    }

    async getUserMessages(userId) {
        return MessageGroupsModel.find({
            participants: { $in: userId },
        }).populate({ path: "participants", select: "userName" });
    }
}

module.exports = new MessageGroupsService();
