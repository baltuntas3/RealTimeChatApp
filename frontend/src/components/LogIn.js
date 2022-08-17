import axios from 'axios';
import { useState, useEffect,useRef } from 'react';
import jwtDecode from 'jwt-decode';
import LogInInputs from './LogInInputs';




export default function LogIn(){

//   useEffect(()=>{
//     const user=getUser()
//   },[])

// Store accessToken and refreshToken as cookie
    async function logIn(login){
        try {
            const isLoggedIn = await axios.post("users/login",{
                "username":login.username,
                "password":login.password
            })

            const {accessToken,refreshToken}=isLoggedIn.data
            localStorage.setItem("token",accessToken)
            console.log(isLoggedIn.data)
            return {"user":isLoggedIn.data,"status":isLoggedIn.status}
            
        } catch (error) {
          return {"error":error.response.data,"status":error.response.status}
        }
    }
    
    const [values, setValues] = useState({
      username: "",
      password: ""
    });
  

    const inputs = [
      {
        id: 1,
        name: "username",
        type: "text",
        placeholder: "Username",
        errorMessage:
          "Username should be 3-16 characters and shouldn't include any special character!",
        label: "Username",
        pattern: "^[A-Za-z0-9]{3,16}$",
        required: true,
      },
      {
        id: 2,
        name: "password",
        type: "password",
        placeholder: "Password",
        errorMessage:
          "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
        label: "Password",
        
        required: true,
      }
    ]

  
    async function handleSubmit(e){
      e.preventDefault()
      const res= await logIn(values)
      if(res.status===200){
        console.log("gönderdim",values,res)
      }
      else{
        console.log(res.error)

      }
    }

    function onChange(e){
      setValues({ ...values, [e.target.name]: e.target.value })
    }

    return (
      <div className="app">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {inputs.map((input) => (
          <LogInInputs
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button>Submit</button>
      </form>
    </div>
    )


};