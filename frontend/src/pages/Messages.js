import React from 'react'
import Messages from '../components/Message'
import { useState, useEffect,useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default function MessagesPage() {
  const socket = useRef();
  const [currentUser,setCurrentUser]=useState(null)
  const [currentChat,setCurrentChat]=useState(null)
  const [messages,setMessages]=useState([])
  const [conversations,setConversations]=useState([])
  const [newMessage,setNewMessage]=useState("")
  const [arrivalMessage, setArrivalMessage] = useState(null);

  async function getMessages(){
    const getMessages = await axios.get("messages/"+currentChat?._id)
    // socket?.on("GeneralRoom",message=>{
    //   console.log(message,groupId)
    // })
    setConversations(getMessages.data)
    console.log(getMessages.data,"------------------------------><")
  }

  

  function getUser(){
    const token = localStorage.getItem("token")
    const getUser = jwtDecode(token)
    setCurrentUser(getUser)
    return getUser
  }

  // getUser()
  async function getInbox(){
    const getInbox = await axios.get("users/inbox")
    setMessages(getInbox.data)
  }


  async function handleSubmit(e){
    const messageBuilder={
      senderId:currentUser.id,
      groupId:currentChat._id,
      message:newMessage
    }
    const send=await axios.post("messages/send",messageBuilder)
    setConversations([...conversations,send.data])
 
    const receiverId = currentChat.participants.find(
      (member) => member._id !== currentUser.id
    );

    socket.current.emit("sendPrivateMessage",{
      senderId:currentUser.id,
      receiverId:receiverId._id,//user.id,
      message:newMessage
    })
  }

  useEffect(() => {
    getInbox()  
    getUser()     
  }, []);

  useEffect(() => {   
    getMessages()
  }, [currentChat]);

  useEffect(() => {
    
    socket.current=io("ws://localhost:3005")
    socket.current.on("getPrivateMessage",(obj)=>{
      console.log(obj)
      setArrivalMessage({
        senderId:obj.senderId,
        message:obj.message
      })
  })
  }, []);
  useEffect(()=>{
    const user=getUser()
    socket.current.emit("addUser",user.id)
    socket.current.on("getUsers",users=>{
      console.log(users)
    })

  },[])

 

  useEffect(() => {
    console.log(arrivalMessage,"------aaa")
    arrivalMessage &&
      setConversations((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

    
  return (
    <div>
      <h1>Message Field</h1>
      {messages.map(data=><div key={data._id}>
        {data.participants.filter(user=>user.userName!==currentUser.username).map(user=><div key={user._id}>
          
          <div onClick={()=>setCurrentChat(data)} style={{border:"1px solid black",width:"200px",height:"100px"}}>
          {user.userName}
        </div>
          
          </div>)}
        
      </div>)}
          {conversations?.map(conversations=><div key={conversations._id}>{conversations.message}</div>)}
      
        <div>
          
          <textarea placeholder='bir şeyler yaz' onChange={e=>setNewMessage(e.target.value)}/><br/>
          <button onClick={handleSubmit}>Gönder</button>
            
        </div>
    </div>
  )
}
