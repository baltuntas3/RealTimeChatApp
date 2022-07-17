const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 4,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    email:{
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    roles:{
        type:[String]
    },
    friends:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User', 
    }]
    
    
})

UserSchema.plugin(require('mongoose-autopopulate'))

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel