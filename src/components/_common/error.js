import React from 'react';

export default props => {
    if (props.message !== '') {
        return <div className="error">
            <p>{props.message} </p>
        </div>;
    }
    return <span />;
};
