import {useState} from "react";

const useFormValid = (initialValues, validationRules) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setValues((prevValues) => ({...prevValues, [name]: value}));

        // const newErrors = validateField(name, value, validationRules);
        // setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] || "" }));
        const newErrors = validateField(name, value, validationRules);
        if (Object.keys(newErrors).length === 0) {
            const {[name]: _, ...restErrors} = errors;
            setErrors(restErrors);
        } else {
            setErrors((prevErrors) => ({...prevErrors, [name]: newErrors[name] || ""}));
        }
    };

    const handleSubmit = (onSubmitCallback) => (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        const newErrors = validateAllFields(values, validationRules);
        setErrors(newErrors);
        //Burada tekrar validate et
        if (Object.keys(newErrors).length === 0) {
            onSubmitCallback(values);
        }
    };

    const validateField = (name, value, validationRules) => {
        const fieldRules = validationRules[name];
        const errors = {};

        if (fieldRules) {
            for (const rule of fieldRules) {
                if (rule.required && !value) {
                    errors[name] = rule.message || "Bu alan zorunludur.";
                    break;
                }

                if (rule.minLength && value.length < rule.minLength) {
                    errors[name] = rule.message || `Minimum ${rule.minLength} karakter girmelisiniz.`;
                    break;
                }

                if (rule.maxLength && value.length > rule.maxLength) {
                    errors[name] = rule.message || `Maximum ${rule.maxLength} karakter girebilirsiniz.`;
                    break;
                }
            }
        }

        return errors;
    };

    const validateAllFields = (values, validationRules) => {
        const formErrors = {};

        for (const name in validationRules) {
            if (validationRules.hasOwnProperty(name)) {
                const value = values[name];
                const fieldErrors = validateField(name, value, validationRules);
                if (Object.keys(fieldErrors).length > 0) {
                    formErrors[name] = fieldErrors[name];
                } else {
                    delete formErrors[name];
                }
            }
        }

        return formErrors;
    };

    return {values, errors, handleChange, handleSubmit};
};
export default useFormValid;
