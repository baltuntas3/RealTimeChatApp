const UserService = require('../services/Users')
const jwtHelper = require('../helpers/JwtHelper')
const errorMessage= require('../helpers/ErrorHandling')

const logIn = async (req, res, next) => {

    //buradan devam et username password al veritabanından kontrol et hashle eşleti mi bak

    try {
        const userInformation = {"username": req.body.username, "password": req.body.password}
        const user = await UserService.findByUserName(userInformation.username)

        if (user) {
            const pass = await jwtHelper.bcryptPasswordChecker(userInformation.password, user.password)//true or false
                if (pass) {
                    const accessToken= await jwtHelper.generateJwtToken({'username': user.userName, 'id': user._id})
                    const refreshToken= await jwtHelper.generateRefreshJwtToken({'username': user.userName, 'id': user._id})
                    req.user = user
                    res.cookie("token",accessToken,{httpOnly: true})
                    res.cookie("refreshToken",refreshToken,{httpOnly: true})
                    console.log(accessToken,refreshToken)
                    res.status(200).send(errorMessage('Başarılı bir şekilde giriş yapıldı.'))
                }else{
                    res.status(401).send(errorMessage('Bilgiler yanlış..'))
                }
                return next()
           

        }
        res.status(401).send(errorMessage('Bilgiler yanlış..'))
        return next()
    } catch (e) {
        res.status(500).send(errorMessage(e.message))
        return next()
    }
}

module.exports = logIn