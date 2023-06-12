const BaseService = require("./BaseService");
const MessageModel = require("../models/Messages");

class MessageService extends BaseService {
    model = MessageModel;

    async sendMessage(groupId, senderId, message) {
        const sendMessage = await this.add({
            messageGroupId: groupId,
            sender: senderId,
            message: message,
        });

        res.json(sendMessage);
    }

    async findAllMessages(groupId) {
        return this.query({
            messageGroupId: groupId,
        });
    }

    async getLastMessageInGroup(groupId) {
        return this.findLastItem({
            messageGroupId: groupId,
        });
    }

    async getMessagesPagination(groupId, pageNumber, nPerPage) {
        return this.queryPagination({ messageGroupId: groupId }, pageNumber, nPerPage);
    }
}

module.exports = new MessageService();
