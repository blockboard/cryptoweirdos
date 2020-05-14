import { container, title } from "assets/jss/material-kit-react.js";

import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";

const imageDetailsPageStyle = {
    container,
    section: {
        padding: "70px 0",
        textAlign: "left"
    },
    root: {
        maxWidth: 512,
        maxHeight: 512,
        position: "relative"
    },
    media: {
      "@media (min-width: 576px)": {
        height: 250,
        width: 250
      },
      "@media (min-width: 768px)": {
        height: 512,
        width: 512
      },
      "@media (min-width: 992px)": {
        height: 512,
        width: 512
      },
      "@media (min-width: 1200px)": {
        height: 512,
        width: 512
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
    ownerName: {
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
};

export default imageDetailsPageStyle;
