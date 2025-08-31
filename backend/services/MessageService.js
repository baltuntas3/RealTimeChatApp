const Service = require("./Service");
const MessageModel = require("../models/Messages");

class MessageService extends Service {
    model = MessageModel;

    async sendMessage(groupId, senderId, message) {
        return await this.add({
            messageGroupId: groupId,
            sender: senderId,
            message: message,
        });

        return sendMessage;
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

    async deleteMessage(messageId) {
        return await this.deleteById(messageId);
    }

    async updateMessage(messageId, newContent) {
        return await this.updateById(messageId, { message: newContent });
    }

    async getMessageById(messageId) {
        return await this.findById(messageId);
    }
}

module.exports = new MessageService();
