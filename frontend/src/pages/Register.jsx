import {useEffect, useState} from "react";
import {registerUser} from "../services/api";
import {useNavigate} from "react-router";
import {useAlert} from "../context/errorMessageContext";
import "../styles/forms/register.css";
import useFormValid from "../hooks/useFormValid";
import {useAtomValue} from "jotai";
import {userInformation} from "../lib/GlobalStates";
// import Alert from "../components/Alert";

const initialValues = {
    username: "",
    email: "",
    password: "",
    age: "",
};

const validationRules = {
    username: [
        {required: true},
        {minLength: 3, message: "Kullanıcı adı en az 3 karakter olmalıdır."},
        {maxLength: 15, message: "Kullanıcı adı en fazla 15 karakter olabilir."},
    ],
    password: [{required: true}, {minLength: 1, message: "şifre en az 3 karakter olmalıdır."}],
    email: [{required: true}, {minLength: 1, message: "şifre en az 3 karakter olmalıdır."}],
    age: [{required: true}, {minLength: 1, message: "şifre en az 3 karakter olmalıdır."}],
};

// const [data, err] = await registerUser(form);
// if (err) return addMessage(err.message);

// setTimeout(() => {
//     navigate("/auth/login");
// }, 2000);

const Register = () => {
    // const [alert, setAlert] = useState("");
    const navigate = useNavigate();

    const {values, errors, handleChange, handleSubmit} = useFormValid(initialValues, validationRules);

    const user = useAtomValue(userInformation);
    const {addMessage} = useAlert();

    const onSubmitForm = async (formData) => {
        // Form verilerini dışarı aktarma işlemi
        const [data, err] = await registerUser(formData);
        if (err) return addMessage(err.message);
        addMessage("Kayıt Başarılı!");
        console.log(formData);
    };

    useEffect(() => {
        if (user) navigate("/profile");
    }, [user]);

    return (
        <div className="register-container dark-mode">
            <div className="register-form">
                <h2 className="register-heading">Kayıt Ol</h2>
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
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="E-posta Adresi"
                            value={values.email}
                            onChange={handleChange}
                            className="input-field"
                        />
                        {errors.username && <p className="error-field">{errors.email}</p>}
                    </div>

                    <div>
                        <label>Age:</label>
                        <input
                            type="age"
                            name="age"
                            placeholder="Yaş"
                            value={values.age}
                            onChange={handleChange}
                            className="input-field"
                        />
                        {errors.username && <p className="error-field">{errors.age}</p>}
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
                        className="register-button">
                        Kayıt Ol
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
