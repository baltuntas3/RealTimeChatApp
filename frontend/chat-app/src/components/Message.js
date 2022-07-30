import axios from 'axios';
import React from 'react'
import { useState, useEffect,useRef } from 'react';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';





export default function Message(){
  const socket = useRef();
  useEffect(() => {

    socket.current=io("ws://localhost:3005")
    // logIn()
    //  getMessages()
    // "GVOjhsCkapyEnyuTAAAv"
    // 62d361ee869d429482cb80a1
    // socketIo("62d361ee869d429482cb80a1","asdasss as")
  }, []);
  useEffect(()=>{
    const user=getUser()
    socket.current.emit("addUser",user.id)
    socket.current.on("getUsers",users=>{
      console.log(users,socket.current)
    })

    socket.current.emit("sendPrivateMessage",{
      senderId:user.id,
      reveiverId:user.id,
      message:"al bu mesaj"
    })

    socket.current.on("getPrivateMessage",(obj)=>{
      console.log(obj)
    })


  },[])




  async function getInbox(){
    const getInbox = await axios.get("groups/inbox")
    socket?.on("GeneralRoom",message=>{
      console.log(message,"---------------------------<")
    })
    console.log(getInbox.data)
  }

  
  function getUser(){
    const token = localStorage.getItem("token")
    const getUser = jwtDecode(token)
    return getUser
    /**
     * privateRoomName,message
     * io.on('connection', (socket) => {
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
     * 
     * 
     *  */ 
  //   console.log(socket)
  // // {senderId:getUser.id,receiverId:'',message} message format
  //     // console.log(socket.id,' a user connected');

      
  //     socket.on('SendMessages', (message,privateRoomName)=>{
  //     //   console.log(message,room)
  //     //  if(privateRoomName===''){
  //     //   socket.broadcast.emit("GeneralRoom",message)
  //     //  }
  //     //  else{
  //         socket.emit(
  //           {senderId:getUser.id,receiverId:"62d1b772d9f0103184f4e8b7",message:message}
  //         )
  //     })
      // socket.on("join-room",room=>{
      //   socket.join(room)
      // })
  }
// Store accessToken and refreshToken as cookie
    async function logIn(){
        try {
            const isLoggedIn = await axios.post("users/login",{
                "username":"Burak1928",
                "password":"123456"
            })

            const {accessToken,refreshToken}=isLoggedIn.data
            localStorage.setItem("token",accessToken)
            console.log(isLoggedIn.data)
            return isLoggedIn.data
            
        } catch (error) {
          return error.message
        }
    }


    async function getMessages(){
        // const tokens = await logIn()
        try {
            // console.log(tokens)
          const getMessages= await axios.get("groups/inbox")
          const messageGroups=getMessages.data
          console.log(messageGroups)
          // return getMessages
        } catch (error) {
          console.log(error)
        }
      }
    
      // 3005 portu dinle inbox idye göre bağlantı aç bence olur.
      // useEffect(() => {
      //   // getMessages()
      // }, []);
    
  return (
    <div>Message</div>
  )
}
