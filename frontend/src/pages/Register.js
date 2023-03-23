import { useState, useEffect } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router";
import Input from "../components/Input";
import Alert from "../components/Alert";

const initialState = {
    username: "",
    email: "",
    password: "",
};

const Register = () => {
    const [form, setForm] = useState(initialState);
    // const [alert, setAlert] = useState("");
    const navigate = useNavigate();

    const onChangeHandler = (e) => {
        setForm((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const buttonClickHandler = () => {
        let error = false;
        Object.keys(form).forEach((key) => {
            if (form[key] === "") error = true;
        });
        if (!error) {
            const data = register(form);
            setForm(initialState);
            if (data) {
                alert("Kayıt başarılı");
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        }
    };

    return (
        <div>
            <Input name="username" value={form.username} onChange={onChangeHandler} placeholder="Username" />
            <Input name="email" value={form.email} onChange={onChangeHandler} type="email" placeholder="email" />
            <Input
                name="password"
                value={form.password}
                onChange={onChangeHandler}
                type="password"
                placeholder="password"
            />
            {/* {alert && <Alert message={alert} />} */}

            <button onClick={buttonClickHandler}>Sign Up</button>
        </div>
    );
};

export default Register;
