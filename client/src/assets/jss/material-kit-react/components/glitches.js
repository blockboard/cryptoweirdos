import { container, title } from "assets/jss/material-kit-react.js";

import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";

const glitchStyle = {
  container,
  section: {
    padding: "70px 0",
    textAlign: "left"
  },
  imgMedia: {
    height: 320,
  },
  img: {
    width: "30px",
    height: "30px",
    borderRadius: "50%"
  },
  linkColor: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
      display: "block",
    }
  },
  root: {
    maxWidth: 550,
    maxHeight: 550,
    position: "relative",
    '&:hover': {
      backgroundColor: 'transparent',
    }
  },
  media: {
    "@media (min-width: 576px)": {
      height: 250,
      width: 250
    },
    "@media (min-width: 768px)": {
      height: 500,
      width: 500
    },
    "@media (min-width: 992px)": {
      height: 500,
      width: 500
    },
    "@media (min-width: 1200px)": {
      height: 600,
      width: 600
    }
  },
  btn: {
    backgroundColor: "transparent",
    color: "black",
    position: "relative",
    //padding: "14px 200px",
    width: "100%",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    border: "2px solid #555555",
    //borderRadius: "px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    "&:hover,&:focus": {
      color: "black",
      background: "rgba(200, 200, 200, 0.2)"
    },
  },
  profile: {
    textAlign: "center",
    "& img": {
      maxWidth: "160px",
      width: "100%",
      margin: "0 auto",
      transform: "translate3d(0, -50%, 0)"
    }
  },
  description: {
    margin: "1.071rem auto 0",
    maxWidth: "600px",
    color: "#999",
    textAlign: "center !important"
  },
  name: {
    marginTop: "-80px"
  },
  ...imagesStyle,
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
    color: "#999"
  },
  sliderName: {
    color: "black"
  },
  socials: {
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
    color: "#999"
  },
  navWrapper: {
    margin: "20px auto 50px auto",
    textAlign: "center"
  },
  tokenName: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    color: "black",
    textDecoration: "none"
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
  artBreederTitle: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    color: "#999999",
    textDecoration: "none"
  },
  signLink: {
    color: "black",
    position: "relative",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    width: "100%",
    textTransform: "uppercase",
    border: "2px solid #555555",
    //borderRadius: "px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    "&:hover,&:focus": {
      color: "black",
      background: "rgba(200, 200, 200, 0.2)"
    },
  },
  signInBtn:{
    color: "inherit",
    position: "relative",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    width: "100%",
    textTransform: "uppercase",
    border: "2px solid #555555",
    //borderRadius: "px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",

  },
};

export default glitchStyle;