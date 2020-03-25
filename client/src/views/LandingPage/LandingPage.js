import React, {Fragment, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import { useAuth } from "context/auth";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import Quote from "components/Typography/Quote";
import useSpinner from "components/Spinner/useSpinner";
// styles
import styles from "assets/jss/material-kit-react/views/landingPage.js";
// Images
import image1 from "assets/img/weirdos/0058.jpeg";
// Sections for this page
import LatestFaces from "./Sections/LatestFaces";
import MostViewed from "./Sections/MostViewed";
import RandomSelection from "./Sections/RandomSelection";

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const classes = useStyles();

  const [overlay, setOverlay] = useState(true);
  const [spinner, showSpinner, hideSpinner] = useSpinner(overlay);

  const { inAuth, setInAuth } = useAuth();

  useEffect(() => {
    if (inAuth) {
      showSpinner();
    } else {
      hideSpinner();
    }
  }, [inAuth]);

  return (
      <>
        <MainHeader />
        {spinner}
        <Parallax small filter image={image1}>
          <div className={classes.container}>
            <GridContainer justify="right">
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={classes.title}>CryptoWeirdos.</h1>
                <br/>
                <Quote
                    className={classes.title}
                    text={<h5>Crypto's many faces. Find your Weirdo.</h5>}
                />
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <MainContainer>
          <LatestFaces/>
          <MostViewed/>
          <GridContainer justify="center">
            <h5 className={classes.artBreederTitle}>CryptoWeirdos is created using ArtBreeder tool by Joel Simon</h5>
          </GridContainer>
        </MainContainer>
        <Footer />
      </>
  );
}
