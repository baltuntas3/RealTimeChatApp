import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";
import Input from "../components/Input";
// import { logIn } from "../services/api";
import { useAlert } from "../context/errorMessageContext";
import { useUser } from "../context/userContext";

export default function LogIn() {
    const navigate = useNavigate();
    const { alertMessage, setAlertMessage } = useAlert();

    const { fetchCurrentUser, user } = useUser();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const submitRef = useRef(null);

    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    async function handleSubmit(e) {
        await fetchCurrentUser(values);
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
        if (user) navigate("/profile");
    }, [user]);

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    return (
        <div className="app">
            <h1>Login</h1>
            <Input
                name="username"
                key="username"
                value={values.username}
                onChange={formChangeHandler}
                ref={usernameRef}
                validations={{
                    required: { value: true, message: "gerekli alan" },
                    maxLength:{value: 10, message: "10 gerekli alan"}
                }}
                onKeyPress={(e) => handleFocus(e, passwordRef)}
            />
            <Input
                name="password"
                key="password"
                value={values.password}
                onChange={formChangeHandler}
                type="password"
                ref={passwordRef}
                validations={{
                    required: { value: true, message: "gerekli alan" },
                }}
                onKeyPress={(e) => handleFocus(e, submitRef)}
            />

            <button onClick={handleSubmit} ref={submitRef}>
                Submit
            </button>
        </div>
    );
}
