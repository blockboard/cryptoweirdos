import React from "react";

// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import Danger from "components/Typography/Danger.js";

// Images
import background from "assets/img/faces/cf7.jpeg";

// Styles
import styles from "assets/jss/material-kit-react/views/createPage.js";

const useStyles = makeStyles(styles);

export default function NotFoundPage(props) {
  const classes = useStyles();
  const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  return (
      <div>
        <MainHeader/>
        <Parallax small filter image={background} />
        <MainContainer>
          <div className={classes.section}>
            <Danger>
              Sorry, Not Found!
            </Danger>
          </div>
        </MainContainer>
        <Footer/>
      </div>
  );
}
