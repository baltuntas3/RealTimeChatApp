import { useState } from "react";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import jwt_decode from "jwt-decode";
import { logIn } from "../api";
import { useUser } from "../context/userContext";

export default function LogIn() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [error, setError] = useState();

    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    async function handleSubmit(e) {
        const res = await logIn(values);
        if (res.status === 200) {
            setUser(jwt_decode(res.user.accessToken));
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
