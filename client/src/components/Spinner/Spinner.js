import React from 'react';
import SpinnerIcon from "./SpinnerIcon";
import {makeStyles} from "@material-ui/core/styles";
import styles from "assets/jss/material-kit-react/components/spinnerStyle.js";

const useStyles = makeStyles(styles);

const Spinner = (props) => {
  const classes = useStyles();
  const styled = props.overlay ? {
    backgroud: "rgba(0,0,0,0.5)",
    height: "100vh",
    width: "100vw",
    position: "fixed"
  } : null;

 return (
    <div className={classes.spinner} style={styled}>
      <SpinnerIcon/>
    </div>
  );
};

export default Spinner;