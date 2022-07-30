import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';

const socket = io("ws://localhost:3005");

export default function Message(){


  async function getInbox(){
    const getInbox = await axios.get("groups/inbox")
    console.log(getInbox.data)
  }

  
  



    // async function getMessages(){
    //     // const tokens = await logIn()
    //     try {
    //       const getMessages= await axios.get("groups/inbox")
    //       const messageGroups=getMessages.data
    //       console.log(messageGroups)
    //       // return getMessages
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }
      useEffect(() => {
        getInbox()       
      }, []);

    
  return (
    <div>Inbox Component</div>
  )
}
