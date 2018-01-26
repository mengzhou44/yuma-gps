import React from "react";

export const renderField = ({
        input, label, placeholder, type, disabled,
    meta: { touched, error }
    }) => {

    return (

        <div className="render-field-container">
            <label>{label}</label>
            <input
                {...input}
                placeholder={placeholder}
                disabled={disabled}

                type={type}
            />

            {touched && error && <div className="error">{error}</div>}

        </div>
    );
};


export const renderCheckboxField = ({
    input, label, disabled, type
}) => {

    return (
        <div className="render-field-container border-test">
            <input
                {...input}
                type={type}
                disabled={disabled}
            /> &nbsp; &nbsp;  <label > {label}</label>

        </div>
    );
};




