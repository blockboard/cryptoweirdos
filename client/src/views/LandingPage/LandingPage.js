import React from "react";
import { Helmet } from "react-helmet-async";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import Quote from "components/Typography/Quote";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import image1 from "assets/img/weirdos/0058.jpeg";
import ForSale from "./Sections/ForSale";
import LastWeirdos from "./Sections/LastWeirdos"
import RecentTransfers from "./Sections/RecentTransfers";

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const classes = useStyles();

  return (
      <>
        <Helmet>
          <meta name="description" 
            content="CryptoWeirdos is a website that provides you with Crypto faces NFTs and each one is unique"/>
        </Helmet>

        <MainHeader />

        {/* {spinner} */}
        <Parallax small filter image={image1}>
          <div className={classes.container}>
            <GridContainer justify="right">
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={classes.title}>CryptoWeirdos.</h1>
                <br/>
                <Quote
                    className={classes.title}
                    text={<h5>You can find CryptoWeirdos collection on 
                      <a
                        href="https://opensea.io/collection/crypto-weirdos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.link}
                      >OpenSea</a>.</h5>}
                />
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>

        <MainContainer>
        {/* <HavingProblem/> */}
          <RecentTransfers/>
          <ForSale/>
          <LastWeirdos/>
        </MainContainer>

        <Footer />
      </>
  );
}
