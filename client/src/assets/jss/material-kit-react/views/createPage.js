import { title } from "assets/jss/material-kit-react.js";

import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";

const createPageStyle = {
    //container,
    root: {
        maxWidth: 345,
        position: "relative"
    },
    media: {
        height: 320,
    },
    mediaContent:{
        height: 50,
    },
    section: {
        padding: "80px 0",
        width: "100%",
        height: "100%",
        textAlign: "center"
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
    /*main: {
        background: "#FFFFFF",
        position: "relative",
        zIndex: "3"
    },
    mainRaised: {
        margin: "-60px 30px 0px",
        borderRadius: "6px",
        boxShadow:
            "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
    },*/
    title: {
        ...title,
        display: "inline-block",
        position: "relative",
        marginTop: "30px",
        minHeight: "32px",
        textDecoration: "none"
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
    container: {
        zIndex: "12",
        color: "#FFFFFF",
        paddingRight: "5px",
        paddingLeft: "5px",
        paddingBottom: "15px",
        marginRight: "auto",
        marginLeft: "auto",
        width: "100%",
        "@media (min-width: 576px)": {
            maxWidth: "540px"
        },
        "@media (min-width: 768px)": {
            maxWidth: "720px"
        },
        "@media (min-width: 992px)": {
            maxWidth: "960px"
        },
        "@media (min-width: 1200px)": {
            maxWidth: "1140px"
        }
    },
    main: {
        background: "#FFFFFF",
        position: "relative",
        zIndex: "3"
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
    mainRaised: {
        //margin: " 5px 0px",
        //borderRadius: "6px",
        //boxShadow:
        //  "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
    }
};

export default createPageStyle;
