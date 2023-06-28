import { useEffect, useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router";
import Input from "../components/Input";
import { useUser } from "../context/userContext";
import { useAlert } from "../context/errorMessageContext";
// import Alert from "../components/Alert";

const initialState = {
    username: "",
    email: "",
    password: "",
    age: "",
};

const Register = () => {
    const [form, setForm] = useState(initialState);
    // const [alert, setAlert] = useState("");
    const navigate = useNavigate();

    const { user } = useUser();
    const { setAlertMessage } = useAlert();

    const onChangeHandler = (e) => {
        setForm((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (user) navigate("/profile");
    }, [user]);

    const buttonClickHandler = async () => {
        let error = false;
        Object.keys(form).forEach((key) => {
            if (form[key] === "") error = true;
        });
        if (error) return setAlertMessage("Alanları doldur!");
        const [data, err] = await registerUser(form);
        if (err) return setAlertMessage(err.message);
        setForm(initialState);
        setAlertMessage("Kayıt başarılı");
        setTimeout(() => {
            navigate("/auth/login");
        }, 1000);
    };

    return (
        <div>
            <Input name="username" value={form.username} onChange={onChangeHandler} placeholder="Username" />
            <Input name="age" value={form.age} onChange={onChangeHandler} placeholder="Age" />
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
