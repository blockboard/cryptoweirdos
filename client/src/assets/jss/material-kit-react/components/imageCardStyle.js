import { container, title } from "assets/jss/material-kit-react.js";
import { red } from '@material-ui/core/colors';

import imagesStyles from "assets/jss/material-kit-react/imagesStyles.js";

const imageCardStyle = {
  root: {
    maxWidth: 450,
    maxHeight: 550,
    position: "center",
    textAlign: "left"
  },
  media: {
    height: 320,
  },
  mediaContent: {
    height: 40,
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
    backgroundColor: red[500],
  },
  img: {
    width: "40px",
    height: "40px",
    borderRadius: "60%"
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
