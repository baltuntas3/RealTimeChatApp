const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()


class JwtHelper{

    constructor(){
        const {ACCESS_SECRET_KEY,REFRESH_TOKEN_SECRET_KEY,TOKEN_EXPIRE_TIME} = process.env
        this.secret= ACCESS_SECRET_KEY
        this.refreshSecret = REFRESH_TOKEN_SECRET_KEY
        this.tokenExpireTime = TOKEN_EXPIRE_TIME
    }

    generateJwtToken(payload){
        return new Promise((resolve,reject)=>{
            const accessToken = jwt.sign(payload, this.secret,{expiresIn:`${this.tokenExpireTime}`},(err,token)=>{
                if(err) return reject(err)
                resolve(token) 
            })
            
        })
    }

    generateRefreshJwtToken(payload){
        return new Promise((resolve,reject)=>{
            const accessRefreshToken = jwt.sign(payload, this.refreshSecret,(err,token)=>{
                if(err) return reject(err)
                resolve(token) 
            })
        })
    }

    bcryptPasswordChecker(formPassword,password){
        return new Promise((resolve,reject)=>{
            bcrypt.compare(formPassword, password,(err,isAuthenticated)=>{
                if(err) return reject(err)
                resolve(isAuthenticated) 
            })
        })
    }

    getPayload(token){
        return jwt.verify(token)
    }


    async regenerateTokenFromRefreshToken(refreshToken,refreshTokenSecret){
        try {
            const user= jwt.verify(refreshToken,refreshTokenSecret)
            const accessToken=await this.generateJwtToken({'username': user.username, 'id': user.id})
            return accessToken
        } catch (error) {
            return error.message
        }
    }

}

module.exports= new JwtHelper()