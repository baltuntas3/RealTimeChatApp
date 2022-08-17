import React from "react";

const Input = ({ value, onChange, ...rest }) => {
    return (
        <div>
            <input value={value} onChange={onChange} {...rest} />
        </div>
    );
};

export default Input;
