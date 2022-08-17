import axios from "axios";
import { useState, useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";
import LogInInputs from "./LogInInputs";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

export default function LogIn() {
    //   useEffect(()=>{
    //     const user=getUser()
    //   },[])

    // Store accessToken and refreshToken as cookie

    const navigate = useNavigate();

    const [error, setError] = useState();
    async function logIn(login) {
        try {
            const isLoggedIn = await axios.post("users/login", {
                username: login.username,
                password: login.password,
            });

            const { accessToken, refreshToken } = isLoggedIn.data;
            localStorage.setItem("token", accessToken);
            console.log(isLoggedIn.data);
            return { user: isLoggedIn.data, status: isLoggedIn.status };
        } catch (error) {
            return { error: error.response.data, status: error.response.status };
        }
    }

    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    const inputs = [
        {
            id: 1,
            name: "username",
            type: "text",
            placeholder: "Username",
            errorMessage: "Username should be 3-16 characters and shouldn't include any special character!",
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
        },
    ];

    async function handleSubmit(e) {
        const res = await logIn(values);
        if (res.status === 200) {
            console.log("gönderdim", values, res);

            navigate("/chats");
        } else {
            setError(res.error);
        }
    }

    function formChangeHandler(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    return (
        <div className="app">
            <h1>Login</h1>
            {error && <Alert message={error.message} />}
            <Input name="username" value={values.username} onChange={formChangeHandler} />
            <Input name="password" value={values.password} onChange={formChangeHandler} type="password" />

            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}
