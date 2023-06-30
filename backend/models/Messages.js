const mongoose = require('mongoose')

const MessagesSchema = new mongoose.Schema({
    messageGroupId:{
        type: String
    },
    sender:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        autopopulate: { select: 'userName',maxDepth:1 }

    },
    message: {
        type:String
    }
        
},{
    timestamps:true
})

MessagesSchema.plugin(require('mongoose-autopopulate'))

const MessagesModel = mongoose.model('Messages', MessagesSchema)

module.exports = MessagesModel