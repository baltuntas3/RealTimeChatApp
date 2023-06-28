import React, { forwardRef, useEffect } from "react";

const Input = ({ onChange, ...rest }, ref) => {
    const errors = { usernam: { message: "aaaaaa" } };
    console.log(rest, "--");

    // Validasyon validasyon oğulları
    //Validasyon ekle.
    //Hata mesajları için bir komponent yapabilirsin. Cb olarak mesajı bas geç

    // useEffect(() => {
    //     console.log(validations, "--");
    //     console.log("-----", ref.current.validations);
    // }, [ref.current]);
    return (
        <div>
            <input onChange={onChange} {...rest} ref={ref} />
            <div>{errors[rest.name] && errors[rest.name].message}</div>
        </div>
    );
};

export default forwardRef(Input);
