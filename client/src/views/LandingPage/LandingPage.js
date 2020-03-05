import React, { Fragment } from "react";

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

// styles
import styles from "assets/jss/material-kit-react/views/landingPage.js";

// Images
import image1 from "assets/img/faces/cf4.jpeg";

// Sections for this page
import LatestFaces from "./Sections/LatestFaces";
import MostViewed from "./Sections/MostViewed";
import RandomSelection from "./Sections/RandomSelection";
import Quote from "../../components/Typography/Quote";

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const classes = useStyles();
  return (
      <Fragment>
        <MainHeader />
        <Parallax filter image={image1}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={classes.title}>CryptoWeirdos</h1>
                <br/>
                <Quote
                    text="Crypto's many faces. Find your Weirdo. All art pieces are unique."
                />
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <MainContainer>
          <RandomSelection/>
          <LatestFaces/>
          <MostViewed/>
        </MainContainer>
        <Footer />
      </Fragment>
  );
}
