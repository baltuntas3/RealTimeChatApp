import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";
import Input from "../components/Input";
// import { logIn } from "../services/api";
import { useAlert } from "../context/errorMessageContext";
import { useUser } from "../context/userContext";

export default function LogIn() {
    const { alertMessage, setAlertMessage } = useAlert();

    const { fetchCurrentUser } = useUser();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const submitRef = useRef(null);

    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    async function handleSubmit(e) {
        const err = await fetchCurrentUser(values);
        setAlertMessage(err?.message);
    }

    function formChangeHandler(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const handleFocus = (e, nextRef) => {
        if (e.key === "Enter") {
            nextRef.current.focus();
        }
    };

    // useEffect(() => {
    //     console.log(user, "-**-*-*-*-");
    // }, [user]);

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    return (
        <div className="app">
            <h1>Login</h1>
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
