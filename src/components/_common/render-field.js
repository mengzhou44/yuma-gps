import React from 'react';
import { Dropdown } from 'semantic-ui-react';

export const renderField = ({
        input, label, placeholder, type, disabled,
    meta: { touched, error }
    }) => {

    return (

        <div className='render-field-container'>
            <label>{label}</label>
            <input
                {...input}
                placeholder={placeholder}
                disabled={disabled}
                type={type}
            />

            {touched && error && <div className='error'>{error}</div>}

        </div>
    );
};

export const renderDropdownField = ({
    input,
    controlId,
    placeholder,
    onSelected,
    options,
    disabled,
    meta: { touched, error }
  }) => {
    return (
        <div>
            <Dropdown
                selection
                fluid
                {...input}
                options={options}
                value={input.value}
                onChange={(param, data) => {
                    input.onChange(data.value);
                    if (onSelected) {
                        onSelected(data.value);
                    }
                }
                }
                placeholder={placeholder}
                disabled={disabled}
            />

            {touched && error && <div className="error">{error}</div>}
        </div>
    );
};



