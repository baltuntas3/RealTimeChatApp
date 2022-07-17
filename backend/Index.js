const express = require('express')
const userRouter = require('./routes/Users')
const messagesRouter = require('./routes/Messages')
const messageGroupsRouter = require('./routes/MessageGroups')

const cors=require('cors')
require('./configs/MongoDBConnection')
const app = express()
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(cors({credentials: true, origin: 'http://localhost:3001'}))
app.use(express.json());



app.use('/users', userRouter)
app.use('/messages', messagesRouter)
app.use('/groups', messageGroupsRouter)



app.listen(3000, () => {
  console.log('Server listening')
})

