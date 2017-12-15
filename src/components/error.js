import React from 'react';

export default props => {
    if (props.message !== '') {
        return <p className="error">{props.message}</p>;
    }
    return <span />;
};
