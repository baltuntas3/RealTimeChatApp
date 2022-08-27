import { useState } from "react";

const Alert = ({ message }) => {
    const [visible, setVisible] = useState(true);

    setTimeout(() => {
        setVisible(false);
    }, 2000);

    if (!visible) return;

    return <div>{message}</div>;
};

export default Alert;
