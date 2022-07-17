const mongoose = require('mongoose')

const MessageGroupsSchema = new mongoose.Schema({

    participants: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }]
},{
    timestamps:true
})

MessageGroupsSchema.plugin(require('mongoose-autopopulate'))

const MessageGroupsModel = mongoose.model('MessageGroups', MessageGroupsSchema)

module.exports = MessageGroupsModel