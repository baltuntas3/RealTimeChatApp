const Service = require("./Service");
const MessageGroupsModel = require("../models/MessageGroups");
const MessageService = require("./MessageService");

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

    async createGroupWithFirstMessage(participants = [], firstMessage = null, senderId = null) {
        const group = await this.addGroup(participants);
        
        if (group && firstMessage && senderId) {
            await this.addMessageToGroup(group._id, senderId, firstMessage);
        }
        
        return group;
    }

    async addMessageToGroup(groupId, senderId, message) {
        const group = await this.findOne({ _id: groupId });
        if (!group) {
            return this.handleError("Grup bulunamadı!");
        }

        const sentMessage = await MessageService.sendMessage(groupId, senderId, message);
        return sentMessage;
    }

    async getGroupWithMessages(groupId, pageNumber = 1, nPerPage = 50) {
        const group = await this.findOne({ _id: groupId });
        if (!group) {
            return this.handleError("Grup bulunamadı!");
        }

        const messages = await MessageService.getMessagesPagination(groupId, pageNumber, nPerPage);
        
        return {
            group,
            messages
        };
    }

    async getAllMessagesInGroup(groupId) {
        const group = await this.findOne({ _id: groupId });
        if (!group) {
            return this.handleError("Grup bulunamadı!");
        }

        return await MessageService.findAllMessages(groupId);
    }

    async getLastMessageInGroup(groupId) {
        return await MessageService.getLastMessageInGroup(groupId);
    }

    async listMyChatGroups(userId) {
        return MessageGroupsModel.find({
            participants: { $in: userId },
        }).populate({ path: "participants", select: "userName" });
    }

    async listMyChatGroupsWithLastMessage(userId) {
        const groups = await this.listMyChatGroups(userId);
        
        const groupsWithLastMessage = await Promise.all(
            groups.map(async (group) => {
                const lastMessage = await this.getLastMessageInGroup(group._id);
                return {
                    ...group.toObject(),
                    lastMessage
                };
            })
        );

        return groupsWithLastMessage;
    }
}

module.exports = new MessageGroupsService();
