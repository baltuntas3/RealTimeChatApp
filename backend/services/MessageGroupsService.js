const Service = require("./Service");
const MessageGroupsModel = require("../models/MessageGroups");

class MessageGroupsService extends Service {
    model = MessageGroupsModel;

    async addGroup(participants = []) {
        const isThereGroup = await this.query({ participants: { $all: participants } });

        if (!isThereGroup.length && participants.length > 0) {
            return await this.add({ participants: participants });
        } else {
            //ileride bunları statik yap.(Hata mesajlarını)
            return this.handleError("Böyle bir grup zaten mevcut!");
        }
    }

    async listMyChatGroups(userId) {
        return MessageGroupsModel.find({
            participants: { $in: userId },
        }).populate({ path: "participants", select: "userName" });
    }
}

module.exports = new MessageGroupsService();
