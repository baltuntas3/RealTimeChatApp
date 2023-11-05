const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
    {
        messageGroupId: {
            type: String,
            required: true,
        },
        sender: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            autopopulate: {select: "userName", maxDepth: 1},
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

MessagesSchema.plugin(require("mongoose-autopopulate"));

const MessagesModel = mongoose.model("Messages", MessagesSchema);

module.exports = MessagesModel;
