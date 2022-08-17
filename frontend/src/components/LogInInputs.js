import { useState, useEffect,useRef } from 'react';

function LogInInputs(props) {
    
      const [focused, setFocused] = useState(false);
      const { label, errorMessage, onChange, id, ...inputProps } = props;
    
      function handleFocus(e){
        setFocused(true);
      };
    
      return (
        <div>
          <label>{label}</label>
          <input
            {...inputProps}
            onChange={onChange}
            onBlur={handleFocus}
            onFocus={() =>
              inputProps.name === "confirmPassword" && setFocused(true)
            }
            focused={focused.toString()}
          />
          <span>{errorMessage}</span>
        </div>
      );
}

export default LogInInputs