import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import style from "assets/jss/material-kit-react/components/mainComponents/mainContainerStyle";

const useStyle = makeStyles(style);

export default function MainContainer(props) {
    const classes = useStyle();
    return (
        <div className={classNames(classes.main, classes.mainRaised)}>
            <div className={classes.container}>
                {props.children}
            </div>
        </div>
    );
}
