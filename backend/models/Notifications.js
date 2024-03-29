const mongoose = require("mongoose");

const NorificationSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    toUser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        autopopulate: {select: "userName", maxDepth: 1},
    },
    type: {
        type: String,
        required: true,
    },
    message: String,
    isApproved: Boolean,
    isSeen: Boolean,
});

NorificationSchema.plugin(require("mongoose-autopopulate"));

const NotificationModel = mongoose.model("Notification", NorificationSchema);

module.exports = NotificationModel;
