const BaseService = require("./BaseService");
const MessageGroupsModel = require("../models/MessageGroups");

class MessageGroupsService extends BaseService {
    model = MessageGroupsModel;

    async addGroup(participants = []) {
        try {
            //Burayı grup yap gendine gel dobarlan! Seni tebrik ediyorum. Maşaallah!
            const isThereGroup = await this.query({ participants: { $all: participants } });

            if (!isThereGroup.length && participants.length > 0) {
                return await this.add({ participants: participants });
            } else {
                //ileride bunları statik yap.(Hata mesajlarını)
                return this.handleError("Böyle bir grup zaten mevcut!");
            }
        } catch (error) {
            return this.handleError(error.message);
        }
    }

    async listMyChatGroups(userId) {
        try {
            return MessageGroupsModel.find({
                participants: { $in: userId },
            }).populate({ path: "participants", select: "userName" });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new MessageGroupsService();
