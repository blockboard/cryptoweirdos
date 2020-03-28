import React, {Fragment, useEffect, useState} from "react";
import web3 from "web3";
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
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles(styles);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function LandingPage(props) {
  const classes = useStyles();

  const [ethWarning, setEthWarning] = useState(false);
  const [networkWarning, setNetworkWarning] = useState(false);

  const [overlay, setOverlay] = useState(true);
  const [spinner, showSpinner, hideSpinner] = useSpinner(overlay);

  const { inAuth, setInAuth } = useAuth();

  useEffect( () => {
    detectEth();
    if (inAuth) {
      showSpinner();
    } else {
      hideSpinner();
    }
  }, [inAuth]);


  const detectEth = async () => {
    if (window.ethereum) {
      window.web3 = new web3(window.ethereum);
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new web3(window.web3.currentProvider);
    }
    else {
      setEthWarning(true);
    }
  };

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
            {(ethWarning) ?
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Alert
                    severity="warning"
                  >
                    Non-Ethereum browser detected. You should consider trying MetaMask!
                  </Alert>
                </GridItem>
              </GridContainer> :
              null
            }
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
