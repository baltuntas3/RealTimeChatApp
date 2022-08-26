import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Input from "../components/Input";
import Alert from "../components/Alert";
import { logIn } from "../api";
import { useUser } from "../context/userContext";

export default function LogIn() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [error, setError] = useState();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const submitRef = useRef(null);

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

    const handleFocus = (e, nextRef) => {
        if (e.key === "Enter") {
            nextRef.current.focus();
        }
    };

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    return (
        <div className="app">
            <h1>Login</h1>
            {error && <Alert message={error.message} />}
            <Input
                name="username"
                value={values.username}
                onChange={formChangeHandler}
                ref={usernameRef}
                onKeyPress={(e) => handleFocus(e, passwordRef)}
            />
            <Input
                name="password"
                value={values.password}
                onChange={formChangeHandler}
                type="password"
                ref={passwordRef}
                onKeyPress={(e) => handleFocus(e, submitRef)}
            />

            <button onClick={handleSubmit} ref={submitRef}>
                Submit
            </button>
        </div>
    );
}
