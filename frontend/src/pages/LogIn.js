import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";
// import Input from "../components/Input";
// import { logIn } from "../services/api";
import { useAlert } from "../context/errorMessageContext";
import { useUser } from "../context/userContext";
import useFormValid from "../hooks/useFormValid";
import "../styles/forms/login.css";

const initialValues = {
    username: "",
    password: "",
};

const validationRules = {
    username: [
        { required: true, message: "Kullanıcı adı zorunludur." },
        { minLength: 3, message: "Kullanıcı adı en az 3 karakter olmalıdır." },
        { maxLength: 15, message: "Kullanıcı adı en fazla 15 karakter olabilir." },
    ],
    password: [
        { required: true, message: "şifre zorunludur." },
        { minLength: 1, message: "şifre en az 3 karakter olmalıdır." },
    ],
};

export default function LogIn() {
    const navigate = useNavigate();

    const { values, errors, handleChange, handleSubmit } = useFormValid(initialValues, validationRules);

    const { fetchCurrentUser, user } = useUser();

    const onSubmitForm = async (formData) => {
        // Form verilerini dışarı aktarma işlemi
        await fetchCurrentUser(formData);
    };

    useEffect(() => {
        if (user) navigate("/profile");
    }, [user]);

    return (
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
                    <button type="submit" className="login-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
