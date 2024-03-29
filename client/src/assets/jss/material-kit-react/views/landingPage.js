import { container, title } from "assets/jss/material-kit-react.js";

const landingPageStyle = {
  container: {
    zIndex: "12",
    color: "#FFFFFF",
    ...container
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    color: "rgba(255, 255, 255, 0.9)",
    textDecoration: "none"
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
  subtitle: {
    fontSize: "1.313rem",
    maxWidth: "500px",
    margin: "10px auto 0"
  },
  link:{
    color:"#fff",
    marginLeft:"4px",
    cursor:"pointer"
  }
};

export default landingPageStyle;
