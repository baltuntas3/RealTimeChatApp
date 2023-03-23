import React, { forwardRef, useEffect } from "react";

const Input = ({ value, onChange, ...rest }, ref) => {
    return (
        <div>
            <input value={value} onChange={onChange} {...rest} ref={ref} />
        </div>
    );
};

export default forwardRef(Input);
