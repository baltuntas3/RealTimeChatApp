const BaseService = require('./BaseService')
const UserModel = require('../models/Users')
const bcrypt = require('bcrypt')
class UserService extends BaseService {
    model = UserModel


    // userName: {
    //     type: String,
    //     required: true,
    //     minlength: 4,
    //     unique: true
    // },
    // password:{
    //     type: String,
    //     required: true,
    //     minlength: 6
    // },
    // email:{
    //     type: String,
    //     required: true
    // },
    // age: {
    //     type: Number,
    //     required: true,
    //     min: 18
    // },
    // authorities:{
    //     type:[String]
    // },
    // friends:[{
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'User', 
    // }]

    async signIn(userInformation) {
        console.log(userInformation)
    
        const hashedPassword = await bcrypt.hash(userInformation.password, 10)
        // const pass= await bcrypt.compare(userInformation.password,hashedPassword)
        try {
            return await this.add({
                userName:userInformation.username,
                password:hashedPassword,
                email:userInformation.email,
                age:userInformation.age,
            })
            
        } catch (err) {
            console.log(err.message)
        }
        // return {hashedPassword,pass: userInformation.password,pa: pass}
       
    }


}

module.exports = new UserService()
