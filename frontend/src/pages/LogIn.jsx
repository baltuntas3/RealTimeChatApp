import {useState, useRef, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import jwtDecode from "jwt-decode";
import {useAlert} from "../context/errorMessageContext";
import useFormValid from "../hooks/useFormValid";
import "../styles/forms/login.css";
import {useAuthContext} from "../context/AuthContext";
import {logInUser} from "../services/Api";

const initialValues = {
    username: "",
    password: "",
};

const validationRules = {
    username: [
        {required: true, message: "Kullanıcı adı zorunludur."},
        {minLength: 3, message: "Kullanıcı adı en az 3 karakter olmalıdır."},
        {maxLength: 15, message: "Kullanıcı adı en fazla 15 karakter olabilir."},
    ],
    password: [
        {required: true, message: "şifre zorunludur."},
        {minLength: 1, message: "şifre en az 3 karakter olmalıdır."},
    ],
};

export default function LogIn() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useAuthContext();
    const {addMessage} = useAlert();
    const {values, errors, handleChange, handleSubmit} = useFormValid(initialValues, validationRules);

    // Get the redirect location from state (set by PrivateRoute)
    const from = location.state?.from?.pathname || "/home";

    async function fetchCurrentUser(payload) {
        const [data, error] = await logInUser(payload);
        if (error) {
            return addMessage(error.message);
        }
        
        const decodedUser = jwtDecode(data.accessToken);
        setUser(decodedUser);
        
        // Small delay to ensure state is set before navigation
        setTimeout(() => {
            navigate(from, { replace: true });
        }, 100);
    }

    const onSubmitForm = async (formData) => {
        await fetchCurrentUser(formData);
    };

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-form">
                    <h2 className="login-heading">Giriş Yap</h2>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Kullanıcı Adı"
                                value={values.username}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {errors.username && <p className="error-field">{errors.username}</p>}
                        </div>

                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Şifre"
                                value={values.password}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {errors.password && <p className="error-field">{errors.password}</p>}
                        </div>
                        <button
                            type="submit"
                            className="login-button">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
