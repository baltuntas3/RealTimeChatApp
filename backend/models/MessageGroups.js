const mongoose = require("mongoose");

const MessageGroupsSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "User",
                autopopulate: {select: "userName", maxDepth: 1},
            },
        ],
        groupName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

MessageGroupsSchema.plugin(require("mongoose-autopopulate"));

const MessageGroupsModel = mongoose.model("MessageGroups", MessageGroupsSchema);

module.exports = MessageGroupsModel;
