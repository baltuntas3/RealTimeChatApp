const express = require('express')
const router = express.Router()
const UserService = require('../services/Users')
const MessageService = require('../services/Messages')
const NotificationService = require('../services/Notifications')
const jwtHelper = require('../helpers/JwtHelper')
const errorMessage= require('../helpers/ErrorHandling')
const successMessage= require('../helpers/SuccessMessageBuilder')
//middlewares
const verifyToken= require('../middlewares/Auth')
//socket.io config ---> transfer to react
const http = require('http');
const server = http.createServer();
server.listen(3005, () => {
    console.log('listening on *:3005');
  });
const { Server } = require("socket.io");
const io = new Server(server,{
  cors:[]
});

router.get('/',verifyToken,  (req, res) => {
    
io.on('connection', (socket) => {
    // console.log(socket.id,' a user connected');
    socket.on('SendMessages',async (message,room)=>{
    //   console.log(message,room)
     if(room===''){
      socket.broadcast.emit("GeneralRoom",message)
     }
     else{
        const {id}= req.user
        const isThereMessageRoom= await MessageService.sendPrivateMessage(id,message,room)
        console.log(isThereMessageRoom)
        socket.to(room).emit("PrivateRoom",message)
     }
    })
    // socket.on("join-room",room=>{
    //   socket.join(room)
    // })
  });

 
    res.sendFile('C:\\Users\\burak\\Documents\\VsCode\\RealTimeChatApp\\frontend\\index.html');
  });


router.get('/logout' , verifyToken,(req, res) => {
    res.clearCookie("token")
    res.clearCookie("refreshToken")
    res.json(successMessage("Başarılı bir şekilde çıkış yapıldı."))
})


//User Profile
router.get('/:id', async (req, res) => {
    const {id}=req.params;
    const user = await UserService.find(id)
    res.send(user)
})


router.post('/sign-in', async (req, res) => {
    // console.log(req.body)
    const user = await UserService.signIn(req.body)
    res.send(user)
})


router.post('/login', async (req,res)=>{
    try {
        const {ACCESS_SECRET_KEY,REFRESH_TOKEN_SECRET_KEY,TOKEN_EXPIRE_TIME} = process.env
        const userInformation = {"username": req.body.username, "password": req.body.password}
        const user = await UserService.findByUserName(userInformation.username)

        if (user) {
            const pass =  jwtHelper.bcryptPasswordChecker(userInformation.password, user.password)//true or false
                if (pass) {
                    const accessToken= jwtHelper.generateJwtToken({'username': user.userName, 'id': user._id})
                    const refreshToken= jwtHelper.generateRefreshJwtToken({'username': user.userName, 'id': user._id})
                    req.user = user
                    res.cookie("token",accessToken,{httpOnly: true})
                    res.cookie("refreshToken",refreshToken,{httpOnly: true})
                    return res.status(200).send({accessToken,refreshToken})
                }else{
                    return res.status(401).send(errorMessage('Bilgiler yanlış..'))
                }


        }
        return res.status(401).send(errorMessage('Bilgiler yanlış..'))
    } catch (e) {
        return res.status(500).send(errorMessage(e.message))
    }
})

router.get('/send-request/:userId', verifyToken , async (req, res) => {
    const {id} = req.user
    const {userId}= req.params
    const checkRequest = await NotificationService.queryOne({
        fromUser:id,
        toUser:userId
    })

    if(id!==userId && !checkRequest){
        const userToSend = await UserService.find(userId)
        console.log(userToSend)
        if(userToSend && !userToSend.friends.includes(id)){//gönderilecek adam varsa ve arkadaşım değilse
            const addRequest = await NotificationService.sendFriendRequest(id,userId)
            console.log(addRequest)
            return res.send(addRequest)
        }
    }
        
    res.send(errorMessage("Hata."))
})

//Gelen kutusu yap istekleri çek onaylarsa ekle
// const userLoggedIn = await UserService.find(id)
// userLoggedIn.friends.push(userToSend._id)




module.exports = router