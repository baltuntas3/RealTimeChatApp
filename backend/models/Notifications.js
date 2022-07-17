const mongoose = require('mongoose')

const NorificationSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    toUser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    type:{
        type: String,
        required: true
    },
    message:{
        type: String
    },
    isSeen:{
        type: Boolean
    } 
})

UserSchema.plugin(require('mongoose-autopopulate'))

const NotificationModel = mongoose.model('Notification', NorificationSchema)

module.exports = NotificationModel