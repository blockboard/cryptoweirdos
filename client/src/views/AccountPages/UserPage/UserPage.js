import React, {Fragment, useEffect, useState} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// @material-ui/icons
import CollectionsIcon from '@material-ui/icons/Collections';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import Favorite from "@material-ui/icons/Favorite";
// core components
import Footer from "components/Footer/Footer.js";
import MainContainer from "components/MainComponents/MainContainer";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import Danger from "components/Typography/Danger.js";
// images
import image7 from "assets/img/weirdos/0011.jpeg";
import profileImg from "assets/img/faces/14.png";
// styles
import styles from "assets/jss/material-kit-react/views/profilePage.js";
import ImageCard from "../../../components/ImageCards/ImageCard";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import {Link, useParams} from "react-router-dom";
import ProfileImgCard from "components/ImageCards/ProfileImgCard/ProfileImgCard";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import Dashboard from "@material-ui/icons/Dashboard";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import StoreIcon from "@material-ui/icons/Store";
import BrushIcon from "@material-ui/icons/Brush";
import BurstModeIcon from "@material-ui/icons/BurstMode";
import Filter9PlusIcon from "@material-ui/icons/Filter9Plus";
import PublishIcon from "@material-ui/icons/Publish";

const useStyles = makeStyles(styles);

function getSteps() {
  return ['Select ', 'Create an ad group', 'Create an ad'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown stepIndex';
  }
}

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

  useEffect(() => {
    fetchAccountDataHandler();
    fetchAccountCollectionsHandler();
  }, []);

  const fetchAccountDataHandler = () => {
    fetch(`https://api.opensea.io/api/v1/accounts?address=${publicAddress}`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(resData => {
          //let [key, value] = Object.entries(resData);
          setAccountName(resData.accounts[0].user.username);
          setAccountPic(resData.accounts[0].profile_img_url);
        })
        .catch(err => {
          //setAccountName(publicAddress);
          setAccountPic(profileImg);
        })
  };

  const fetchAccountCollectionsHandler = () => {
    fetch(`https://api.opensea.io/api/v1/assets?owner=${publicAddress}&asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&limit=100`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(resData => {
          if (resData.assets[0] === undefined  || resData.assets.length == 0) {
            setTokenCard(
              <div>
                <Danger>
                  No Collections, go and pick your Weirdo.
                </Danger>
                <Link to="/gallery" className={classes.linkColor}>
                  <Button
                    simple
                    color="facebook"
                    size="lg">
                    View All
                  </Button>
                </Link>
              </div>
            )
          } else {
            for (let [key, value] of Object.entries(resData)) {
              setTokenCard(value.map(token => {
                return (
                  <GridItem xs={12} sm={12} md={4} lg={4} xl={4}>
                    <ProfileImgCard
                      tokenId={token.token_id}
                      faceImage={token.image_url}
                      faceName={token.name}
                    />
                  </GridItem>)
              }))
            }
          }
        })
      .catch( err => {
        console.log(err);
      })
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
