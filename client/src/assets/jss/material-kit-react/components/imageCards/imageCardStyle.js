import { container, title } from "assets/jss/material-kit-react.js";
import { red } from '@material-ui/core/colors';

import imagesStyles from "assets/jss/material-kit-react/imagesStyles.js";

const imageCardStyle = {
  root: {
    maxWidth: 450,
    maxHeight: 550,
    position: "center",
    textAlign: "left",
    color: "#3C4858",
    "&:hover,&:focus": {
      color: "black",
      background: "rgba(200, 200, 200, 0.2)",
      boxShadow:
        "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
    },
  },
  media: {
    height: 320,
    "&:hover,&:focus": {
      color: "black",
      background: "rgba(200, 200, 200, 0.2)"
    },
  },
  mediaContent: {
    height: 40,
    fontStyle: "Bold"
  },
  headerContent: {
    height: 55
  },
  loveIcon: {
    position: "absolute",
    right: 5
  },
  shareIcon: {
    position: "absolute",
    right: 40
  },
  marginLeft: {
    marginLeft: "auto !important"
  },
  avatar: {
    width: "30px",
    height: "30px",
    backgroundColor: red[400],
  },
  img: {
    width: "30px",
    height: "30px",
    borderRadius: "50%"
  },
  cardImage: {
    width: "300px",
    height: "300px",
  },
  linkColor: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
      display: "block",
    }
  },
  ...imagesStyles
};

export default imageCardStyle;
