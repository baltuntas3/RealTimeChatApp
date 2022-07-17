const express = require('express')
const router = express.Router()
const UserService = require('../services/Users')
// const NotificationService = require('../services/Notifications')
const MessageService = require('../services/Messages')
const logIn= require('../middlewares/LogIn')
const verifyToken= require('../middlewares/Auth')
// const jwtHelper = require('../helpers/JwtHelper')
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

// res.cookie("token", "", {
//     maxAge: 0,
//     httpOnly: true,
//   });

//   res.cookie("refreshToken", "", {
//     maxAge: 0,
//     httpOnly: true,
//   });
//  res.json("oldu")
// return next()
    console.log(req.cookies)
    res.json("sdsa")

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


router.post('/login',logIn, async(req,res)=>{
    
    if(res.statusCode == 200){
            console.log('olduu asdas wwww')
    }
    
})

router.get('/all/json', verifyToken , async (req, res) => {
    const users = await UserService.findAll()
    res.json(users)
})






module.exports = router