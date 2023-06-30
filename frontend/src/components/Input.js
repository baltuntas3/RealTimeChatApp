import React, { forwardRef, useEffect, useMemo, useState } from "react";

const errors = {};
const Input = ({ onChange, ...rest }, ref) => {
  //   const [errors, setErrors] = useState({});

  //   console.log(rest, "--");

  //   // const input=useMemo(()=>{
  const createErrorSet = () => {
    errors[rest.name] = errors[rest.name] || new Set();
  };

  const addErrorMessageByKey = (key) => {
    errors[rest.name].add(rest.validations?.[key]?.message);
  };

  const deleteErrorMessageByKey = (key) => {
    errors[rest.name].delete(rest.validations?.[key]?.message);
  };

  // },[rest.value])

  //   useEffect(() => {
  // const error = {};

  createErrorSet();

  if (rest?.validations?.required?.value && !rest?.value?.length) {
    addErrorMessageByKey("required");
  } else {
    deleteErrorMessageByKey("required");
  }

  if (
    rest?.validations?.maxLength?.value &&
    rest?.value?.length >= rest?.validations?.maxLength?.value
  ) {
    addErrorMessageByKey("maxLength");
  } else {
    deleteErrorMessageByKey("maxLength");
  }
  // setErrors((prev) => ({ ...prev, errors}));
  console.log("render renderoğlu");
  //   }, [rest.value]);
  const errArray = [];
  errors[rest.name].forEach((val) => errArray.push(val));

  console.log(errArray, "--");

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
      <div>{errArray.length && errArray.map((val) => val)}</div>
    </div>
  );
};

export default forwardRef(Input);
