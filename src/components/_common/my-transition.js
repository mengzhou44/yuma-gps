import React from 'react';
import { Transition } from "semantic-ui-react";

export default (props) => {
    let duration = 0;
    if (props.visible === true) {
        duration = 500;
    }

    return (
        <Transition visible={props.visible} animation='scale' duration={duration}>
            {props.children}
        </Transition>
    );
}