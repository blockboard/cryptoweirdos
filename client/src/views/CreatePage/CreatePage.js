import React, {useEffect, useState} from "react";
import web3 from "web3";
// nodejs library that concatenates classes
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import OfferImgCard from "components/ImageCards/SalesImgCard/SalesImgCard";
import Glitch from "components/Glitch/Glitch";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import useSpinner from "components/Spinner/useSpinner";
import { useAuth } from "context/auth";
// Images
import image1 from "assets/img/alex2.jpg";
// Styles
import styles from "assets/jss/material-kit-react/views/createPage.js";

import classNames from "classnames";
import MuiAlert from "@material-ui/lab/Alert";

// @material-ui/icons
const useStyles = makeStyles(styles);

// TODO: Fixed Tabs

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <Typography
          component="div"
          role="tabpanel"
          hidden={value !== index}
          id={`scrollable-auto-tabpanel-${index}`}
          aria-labelledby={`scrollable-auto-tab-${index}`}
          {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const dashboardRoutes = ["/"];

export default function CreatePage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const [tokenCard, setTokenCard] = useState(null);

  const [ethWarning, setEthWarning] = useState(false);
  const [networkWarning, setNetworkWarning] = useState(false);

  const [overlay, setOverlay] = useState(true);
  const [spinner, showSpinner, hideSpinner] = useSpinner(overlay);

  const { authTokens, inAuth, setInAuth, isMinting, setIsMinting } = useAuth();

  const savedIsMinted = localStorage.getItem("Minting");

  useEffect( () => {
    if (inAuth) {
      showSpinner();
    } else {
      hideSpinner();
    }
    
  }, [inAuth, isMinting]);

  useEffect(() => {
    fetchLatestBornHandler();
  }, []);

  const detectEth = async () => {
    if (window.ethereum) {
      window.web3 = new web3(window.ethereum);
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  };

  const fetchLatestBornHandler = async () => {
    fetch(`https://api.opensea.io/api/v1/events?asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&event_type=created&only_opensea=true&limit=20`, {
      method: 'GET',
    })
        .then(res => res.json())
        .then(resData => {
          for (let [key, value] of Object.entries(resData)) {
            setTokenCard(value.map(token => {
              if (token.asset === null) {
                return 0;
              }
              return (
                  <GridItem xs={12} sm={6} md={12} lg={12} xl={12}>
                    <OfferImgCard
                        key={token.id}
                        accountAddress={token.asset.owner.address}
                        tokenId={token.asset.token_id}
                        faceImage={token.asset.image_url}
                        faceName={token.asset.name}
                        ownerImage={token.asset.owner.profile_img_url}
                        ownerName={token.asset.owner.user.username}
                        faceDate={""}
                        openSeaLink={token.asset.permalink}
                        imagePrice={web3.utils.fromWei(token.starting_price, 'ether')}
                        // TODO: image price
                    />
                  </GridItem>)
            }))
          }
        })
        .catch(err => console.log(err));
  };


  return (
      <>
        <Header
          color="default"
          routes={dashboardRoutes}
          brand="CRYPTOWEIRDOS"
          rightLinks={<HeaderLinks/>}
          fixed
          changeColorOnScroll={{
            height: 0,
            color: "white"
          }}
          {...rest}
        />
        {spinner}
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
            <div className={classes.section}>
              <GridContainer justify="center">
                <h5 className={classes.artBreederTitle}>Glitch and trade your weirdo.</h5>
              </GridContainer>
              {(authTokens === null) ?
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Alert
                      severity="warning"
                    >
                      Please Sign-In first to be able to Glitch.
                    </Alert>
                  </GridItem>
                </GridContainer> :
                null
              }

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
              <Glitch
                faceImage={image1}
              />
            </div>
          </div>
        </div>
        <Footer/>
      </>
  );
}
