import React, {useCallback, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import { Helmet } from "react-helmet-async";
import web3 from "web3";
import { withRouter } from 'react-router';
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
// @material-ui/icons
import CollectionsIcon from '@material-ui/icons/Collections';

// core components
import Button from "components/CustomButtons/Button.js";
import Footer from "components/Footer/Footer.js";
import MainContainer from "components/MainComponents/MainContainer";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import Danger from "components/Typography/Danger.js";
import { useAuth } from "context/auth";
import image7 from "assets/img/weirdos/0011.jpeg";
import profileImg from "assets/img/faces/14.png";
import styles from "assets/jss/material-kit-react/views/profilePage.js";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ProfileImgCard from "components/ImageCards/ProfileImgCard/ProfileImgCard";

const useStyles = makeStyles(styles);

function UserPage(props) {
  const classes = useStyles();
  const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
  );

  const [setGlitchFees] = useState(null);
  const [tokenCard, setTokenCard] = useState(null);
  const [accountPic, setAccountPic] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [owner, setOwner] = useState(false);

  let { publicAddress } = useParams();

  const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
  const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS;
  const NETWORK = process.env.REACT_APP_NETWORK;

  const {
    authTokens,
    accountAddress
  } = useAuth();

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

  const glitchFeesHandler  = async () => {
    detectEth();
    if (!INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
      console.error("Please set a mnemonic, infura key, owner, network, and contract address.");
      return
    }
  };

  const fetchAccountDataHandler = useCallback(() => {
    fetch(`https://api.opensea.io/api/v1/accounts?address=${publicAddress}`, {
      method: 'GET',
      headers: {Accept: 'application/json', 'X-API-KEY': '560248ea4c5a46ef9f02e7ef321f6ff3'}
    })
        .then(res => res.json())
        .then(resData => {
          setAccountName(resData.accounts[0].user.username);
          setAccountPic(resData.accounts[0].profile_img_url);
        })
        .catch(err => {
          setAccountPic(profileImg);
        })
  },[publicAddress]);

  const fetchAccountCollectionsHandler = useCallback(() => {
    fetch(`https://api.opensea.io/api/v1/assets?owner=${publicAddress}&asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&limit=100`, {
      method: 'GET',
      headers: {Accept: 'application/json', 'X-API-KEY': '560248ea4c5a46ef9f02e7ef321f6ff3'}
    })
        .then(res => res.json())
        .then(resData => {
          if (resData.assets[0] === undefined  || resData.assets.length === 0) {
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
              setTokenCard(resData.assets.map(token => {
                return (
                  <GridItem xs={12} sm={12} md={4} lg={4} xl={4}>
                    <ProfileImgCard
                      tokenId={token.token_id}
                      faceImage={token.image_url}
                      faceName={token.name}
                      contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                    />
                  </GridItem>)
              }))
          }
        })
      .catch( err => {
        console.log(err);
      })
  },[classes.linkColor, publicAddress]);

  const isOwnerHandler = useCallback(async () => {
    fetch(`${process.env.REACT_APP_BACKEND_API}/accounts/${accountAddress}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(resData => {
        setOwner(resData.account.isArtist);
        fetchAccountDataHandler();
        fetchAccountCollectionsHandler();
      })
      .catch(err => {
        fetchAccountDataHandler();
        fetchAccountCollectionsHandler();
      })
  },[accountAddress, fetchAccountCollectionsHandler, fetchAccountDataHandler]);

  useEffect(() => {
    if (authTokens) {
      isOwnerHandler();
    } else {
      fetchAccountDataHandler();
      fetchAccountCollectionsHandler();
    }
  }, [owner, authTokens, fetchAccountCollectionsHandler, fetchAccountDataHandler, isOwnerHandler]);

  return (
    <>
      <Helmet>
          <meta name="description" 
            content="Profile displays all your assets(NFTS) that comes from OpenSea marketplace"/>
      </Helmet>
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
                {(owner) ?
                  <NavPills
                    alignCenter
                    color="primary"
                    tabs={[
                      {
                        tabButton: "Collections",
                        tabIcon: CollectionsIcon,
                        tabContent: (
                          <GridContainer justify="center" spacing={1}>
                            {
                              (tokenCard === null) ?
                                <CircularProgress disableShrink /> : tokenCard
                            }
                          </GridContainer>
                        )
                      },
                      {
                        tabButton: "Fees",
                        tabIcon: AttachMoneyIcon,
                        tabContent: (
                          <>
                            <GridContainer justify="center">
                              <h5 className={classes.artBreederTitle}>Admin Only! You can here set a new value for your Glitch</h5>
                            </GridContainer>
                            <GridContainer justify="center">
                              <TextField
                                required
                                id="outlined-helperText"
                                label="New Ether Value"
                                helperText="Set value on Ether"
                                variant="outlined"
                                onChange={event => {
                                  setGlitchFees(event.target.value);
                                }}
                              />
                            </GridContainer>
                            <GridContainer justify="center">
                              <GridItem xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Button
                                  color="primary"
                                  className={classes.mintBtn}
                                  round
                                  size="lg"
                                  onClick={glitchFeesHandler}
                                >
                                  Change Glitch Fees
                                </Button>
                              </GridItem>
                            </GridContainer>
                            </>
                        )
                      }
                    ]}
                  /> :
                  <GridContainer justify="center" spacing={1}>
                    {
                      (tokenCard === null) ?
                        <CircularProgress disableShrink /> : tokenCard
                    }
                  </GridContainer>
                }
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </MainContainer>
      <Footer />
    </>
  );
}

export default withRouter(UserPage);