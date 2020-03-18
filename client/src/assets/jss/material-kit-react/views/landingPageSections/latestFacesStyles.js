import { container, title } from "assets/jss/material-kit-react.js";
import { red } from '@material-ui/core/colors';

import imagesStyles from "assets/jss/material-kit-react/imagesStyles.js";

const latestFacesStyle = {
  section: {
    padding: "70px 0",
    textAlign: "center"
  },
  container,
  space50: {
    height: "50px",
    display: "block"
  },
  title: {
    ...title,
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative",
    width: "100%"
  },
  signLink: {
    color: "inherit",
    position: "relative",
    padding: "0.9375rem",
    marginTop: "15px",
    //paddingTop: "10px",
    fontWeight: "500",
    fontSize: "13px",
    width: "100%",
    textTransform: "uppercase",
    border: "2px solid #555555",
    //borderRadius: "px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    "&:hover,&:focus": {
      color: "inherit",
      background: "rgba(200, 200, 200, 0.2)",
      boxShadow:
        "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
    },
  },
  linkColor: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
      display: "block",
    }
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  },
  marginLeft: {
    marginLeft: "auto !important"
  },
  ...imagesStyles
};

export default latestFacesStyle;
