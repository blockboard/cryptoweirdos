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
import Button from "components/CustomButtons/Button.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";

// styles
import styles from "assets/jss/material-kit-react/views/landingPage.js";

// Images
import image1 from "assets/img/faces/cf4.jpeg";

// Sections for this page
import ProductSection from "./Sections/ProductSection.js";
import TeamSection from "./Sections/TeamSection.js";
import WorkSection from "./Sections/WorkSection.js";
import LatestFaces from "./Sections/LatestFaces";

const dashboardRoutes = [];

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
              <br />
            </GridItem>
          </GridContainer>
        </div>
        </Parallax>
        <MainContainer>
            <LatestFaces />
            <ProductSection />
            <TeamSection />
            <WorkSection />
        </MainContainer>
      <Footer />
    </Fragment>
  );
}
