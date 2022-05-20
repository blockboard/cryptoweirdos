import { container } from "assets/jss/material-kit-react.js";

const mainContainerStyle = {
    container: {
        zIndex: "12",
        color: "#FFFFFF",
        ...container
    },
    main: {
        background: "#FFFFFF",
        position: "relative",
        zIndex: "3"
    },
    mainRaised: {
        margin: " 5px 0px",
        borderRadius: "6px",
    }
};

export default mainContainerStyle;
