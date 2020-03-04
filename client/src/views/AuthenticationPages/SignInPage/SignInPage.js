import React, { useState, Fragment } from "react";

// react components
import { Link, Redirect } from "react-router-dom";

// pkgs
import axios from 'axios-instance';
import Web3 from "web3";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import CardActions from "@material-ui/core/CardActions";

// @material-ui/icons
import People from "@material-ui/icons/People";

// svg icons
import MetaMaskIcon from "assets/img/svgs/metamask.svg";

// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import MainHeader from "components/MainComponents/MainHeader";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";

import { useAuth } from "context/auth";

import styles from "assets/jss/material-kit-react/views/signInPage.js";

import image from "assets/img/bg7.jpg";

const useStyles = makeStyles(styles);

export default function SignInPage(props) {
  const web3 = new Web3(window.ethereum);

  const classes = useStyles();
  const { ...rest } = props;

  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [nonce, setNonce] = useState();
  const [publicAddress, setPublicAddress] = useState();
  const [signature, setSignature] = useState();
  const [username, setUsername] = useState("iskande");
  const [password, setPassword] = useState("iskanderi");
  const [userId, setUserId] = useState();
  const [authLoading, setAuthLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);

  const { setAuthTokens, authTokens, setCurrentPublicAddress, currentPublicAddress } = useAuth();

  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  const signInHandler = (event) => {
    // TODO: solve auto detection issue
    console.log(
        `Username: ${username} \n
         Password: ${password}`
    );
    event.preventDefault();
    axios.post('/api/auth/signin', {
      username: username,
      password: password
    }, {
      headers: {
        'content-type': 'application/json'
      },
    })
        .then(res =>{
          if (res.status === 404) {
            setIsError(true);
            throw new Error(
                "User not found!"
            );
          } else if (res.status === 401) {
            setIsError(true);
            throw new Error(
                "Wrong password!"
            );
          } else if (res.status !== 200 && res.status !== 201) {
            console.log('Error!');
            setIsError(true);
            throw new Error("" +
                "Could not authenticate you!"
            );
          }
          return res;
        })
        .then(resData => {
          console.log(resData);
          setAuthLoading(false);
          setUserId(resData.userId);
          setAuthTokens(resData.token);
          setLoggedIn(true);
        })
        .catch(err => {
          console.log(err);
        });
  };

  const signInMetaMaskHandler = (publicAddress) => {
    console.log(publicAddress);
    fetch(`${process.env.REACT_APP_BACKEND_API}/accounts`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
        .then(res => {
          // TODO: validate Ethereum Address
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Creating a user failed!');
          }
          return res.json();
        })
        .then(account => {
          console.log('ACCOUNT:',account);
        })
        .catch(err => {
          console.log('ERROR', err);
        });
  };

  const signMessageHandler = async (publicAddress, nonce) => {
      const signature = await web3.eth.personal.sign(
          `I am signing my one-time nonce: ${nonce}`,
          publicAddress,
          // MetaMask will ignore the password argument here
      );
      await authenticateHandler(publicAddress, signature);
  };

  const authenticateHandler = (publicAddress, signature) => {
    console.log(`publicAddress: ${publicAddress}, \n signature: ${signature}`);

    fetch(`${process.env.REACT_APP_BACKEND_API}/auth/signin`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
        .then(res => res.json())
        .then(resData => {
          console.log('Fished Authentication: ', resData);
        })
        .then(setLoggedIn(true))
        .catch(err => console.log('authenticateHandlerError: ', err));
  };

  const checkHandler = async (event) => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const currentPublicAddress= await web3.eth.getCoinbase();
        setPublicAddress(currentPublicAddress);

        fetch(`${process.env.REACT_APP_BACKEND_API}/accounts/${currentPublicAddress}`, {
          method: 'GET'
        })
            .then(res => {
              if (res.status === 404) {
                signInMetaMaskHandler(currentPublicAddress);
              }
              return res.json();
            })
            .then(account => {
              signMessageHandler(account.account.publicAddress, account.account.nonce);
            })
            .catch(err => {
              console.log('checkHandlerError: ', err);
            })
      } catch (error) {
        // User denied account access...
        console.log(error);
      }
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  if (isLoggedIn) {
    return <Redirect to={"/"}/>
  }

  return (
      <Fragment>
        <MainHeader/>
        <div
            className={classes.pageHeader}
            style={{
              backgroundImage: "url(" + image + ")",
              backgroundSize: "cover",
              backgroundPosition: "top center"
            }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Sign In</h4>
                    </CardHeader>
                    <CardBody>
                      <CustomInput
                          labelText="Username or Email"
                          id="username"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "text",
                            endAdornment: (
                                <InputAdornment position="end">
                                  <People className={classes.inputIconsColor} />
                                </InputAdornment>
                            )
                          }}
                          callbackFromParent={(username) => {
                            setUsername(username);
                          }}
                      />
                      <CustomInput
                          labelText="Password"
                          id="password"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "password",
                            endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputIconsColor}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                            ),
                            autoComplete: "off"
                          }}
                          callbackFromParent={(password) => {
                            setPassword(password);
                          }}
                      />
                    </CardBody>
                    { isError === true ?
                        // TODO: Error msg
                        <CardFooter className={classes.cardFooter}>
                          <SnackbarContent
                              message={
                                <span>
                                  <b>DANGER ALERT:</b> You've got some friends nearby, stop looking
                                  at your phone and find them...
                                </span>
                              }
                              close
                              color="danger"
                              icon="info_outline"
                          />
                        </CardFooter> : <dvv></dvv> }
                    <CardFooter className={classes.cardFooter}>
                      <Button
                          className={classes.signInBtn}
                          round
                          color="primary"
                          size="lg"
                          onClick={signInHandler}>
                        Sign In
                      </Button>
                    </CardFooter>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                          className={classes.signLink}
                          round
                          color="transparent"
                          size="lg"
                          onClick={checkHandler}>
                        <Icon classes={{root: classes.iconRoot}}>
                          <img className={classes.imageIcon} src={MetaMaskIcon}/>
                        </Icon> | Sign In With MetaMask
                      </Button>
                    </CardFooter>
                    <CardActions style={{ justifyContent: "space-between" }}>
                      <Link to={"/"}>
                        Forget Password?
                      </Link>
                      <Link to={"/signup"}>
                        Don't have an account? Sign Up
                      </Link>
                    </CardActions>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <Footer whiteFont />
        </div>
      </Fragment>
  );
}
