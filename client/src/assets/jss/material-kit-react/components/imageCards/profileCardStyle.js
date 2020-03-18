import { container, title } from "assets/jss/material-kit-react.js";
import { red } from '@material-ui/core/colors';

import imagesStyles from "assets/jss/material-kit-react/imagesStyles.js";

const activityCardStyle = {
  root: {
    maxWidth: 450,
    maxHeight: 550,
    position: "center",
    textAlign: "left",
    color: "#3C4858",
  },
  media: {
    height: 320,
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

export default activityCardStyle;