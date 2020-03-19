import React, {Fragment, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
// @material-ui/icons
// core components
import Footer from "components/Footer/Footer.js";
import MainContainer from "components/MainComponents/MainContainer";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import Danger from "components/Typography/Danger.js";
import ProfileImgCard from "components/ImageCards/ProfileImgCard/ProfileImgCard";
// images
import image7 from "assets/img/weirdos/0011.jpeg";
import profileImg from "assets/img/faces/avatar.jpg";
// styles
import styles from "assets/jss/material-kit-react/views/profilePage.js";


const useStyles = makeStyles(styles);

export default function UserPage(props) {
  const classes = useStyles();
  const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
  );
  // TODO: send account info via hidden params
  const [tokenCard, setTokenCard] = useState(null);
  const [accountPic, setAccountPic] = useState(null);
  const [accountName, setAccountName] = useState(null);

  const [activeStep, setActiveStep] = React.useState(0);

  let { publicAddress } = useParams();

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  return (
    <>
      <MainHeader/>
      <Parallax small filter image={image7} />
      <MainContainer>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              {(accountPic === null) ?
                <div>
                  <br/>
                  <CircularProgress disableShrink/>
                </div> :
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div>
                      <img src={accountPic} alt="..." className={imageClasses} />
                    </div>
                    <div className={classes.name}>
                      <h3 className={classes.title}>{(accountName === null) ? publicAddress : accountName}</h3>
                      <br/>
                      <h5 className={classes.title}>{(accountName === null) ? " " : publicAddress}</h5>
                    </div>
                  </div>
                </GridItem>}
            </GridContainer>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={12} lg={12} xl={12} className={classes.navWrapper}>
                <GridContainer justify="center" spacing={1}>
                  {
                    (tokenCard === null) ?
                    <CircularProgress disableShrink /> : tokenCard
                  }
                </GridContainer>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </MainContainer>
      <Footer />
    </>
  );
}
