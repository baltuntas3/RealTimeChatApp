const BaseService = require("./BaseService");
const MessageModel = require("../models/Messages");

class MessageService extends BaseService {
    model = MessageModel;

    async sendMessage(groupId, senderId, message) {
        try {
            const sendMessage = await this.add({
                messageGroupId: groupId,
                sender: senderId,
                message: message,
            });

            res.json(sendMessage);
        } catch (err) {
            return this.handleError(err.message);
        }
    }

    async findAllMessages(groupId) {
        try {
            return this.query({
                messageGroupId: groupId,
            });
        } catch (err) {}
    }

    async getLastMessageInGroup(groupId) {
        try {
            return this.findLastItem({
                messageGroupId: groupId,
            });
        } catch (err) {
            return this.handleError(err.message);
        }
    }

    async getMessagesPagination(groupId, pageNumber, nPerPage) {
        try {
            return this.queryPagination({ messageGroupId: groupId }, pageNumber, nPerPage);
        } catch (err) {
            return this.handleError(err.message);
        }
    }
}

module.exports = new MessageService();
