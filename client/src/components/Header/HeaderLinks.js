/*eslint-disable*/
import React from "react";
// react components
import { Link, withRouter } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Warning from "@material-ui/icons/Warning";
// @material-ui/icons
// core components
import Button from "components/CustomButtons/Button.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
// images
import artistProfileImage from "assets/img/faces/s+.jpeg";
import accountProfileImage from "assets/img/faces/i+avatar.jpg";

import { useAuth } from "context/auth";
// styles
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import {Icon} from "@material-ui/core";

import MetaMaskIcon from "assets/img/svgs/metamask.svg"

const useStyles = makeStyles(styles);

function HeaderLinks(props) {
  const classes = useStyles();

  const { authTokens, currentPublicAddress } = useAuth();

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
     /*(
       <>
        <SnackbarContent
          message={
            <span>
            <b>WARNING ALERT:</b> You{"'"}ve got some friends nearby, stop
            looking at your phone and find them...
          </span>
          }
          close
          color="warning"
          icon={Warning}
        />
        </>
     )*/
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  return (
      <List className={classes.list}>
        <listItem className={classes.listItem}>
          <Link to="/gallery" className={classes.linkColor}>
            {(props.location.pathname === "/gallery") ? <Button
              color="transparent"
              round
              className={classes.selectedNavLink}>
              Gallery
            </Button> : <Button
              color="transparent"
              round
              className={classes.navLink}>
              Gallery
            </Button>}
          </Link>
        </listItem>

        {/*<SnackbarContent
          message={
            <span>
            <b>WARNING ALERT:</b> You{"'"}ve got some friends nearby, stop
            looking at your phone and find them...
          </span>
          }
          close
          color="warning"
          icon={Warning}
        />*/}

        <listItem className={classes.listItem}>
          <Link to="/activity" className={classes.linkColor}>
            {(props.location.pathname === "/activity") ? <Button
              color="transparent"
              round
              className={classes.selectedNavLink}>
              Activity
            </Button> :
            <Button
              color="transparent"
              round
              className={classes.navLink}>
              Activity
            </Button>}
          </Link>
        </listItem>

        <listItem className={classes.listItem}>
          <Link to="/offers" className={classes.linkColor}>
            {(props.location.pathname === "/offers") ? <Button
                color="transparent"
                round
                className={classes.selectedNavLink}>
                Sales
              </Button> :
              <Button
                color="transparent"
                round
                className={classes.navLink}>
                Sales
              </Button>}
          </Link>
        </listItem>

        {/*<listItem className={classes.listItem}>
          <Link to="/blog" className={classes.linkColor}>
            <Button
                color="transparent"
                round
                className={classes.navLink}>
              Blog
            </Button>
          </Link>
        </listItem>*/}

        <listItem className={classes.listItem}>
          <Link to="/create" className={classes.linkColor}>
            {(props.location.pathname === "/create") ? <Button
                color="transparent"
                round
                className={classes.selectedNavLink}>
                create
              </Button> :
              <Button
                color="transparent"
                round
                className={classes.navLink}>
                Create
              </Button>}
          </Link>
        </listItem>

        { (authTokens === null) ?
            <listItem className={classes.listItem}>
                <Button
                    className={classes.signLink}
                    round
                    color="transparent"
                    size="lg"
                    onClick={checkHandler} >
                  Sign In |
                    <Icon classes={{root: classes.iconRoot}}>
                         <img className={classes.icon} src={MetaMaskIcon}/>
                    </Icon>
                </Button>
            </listItem> : ( currentPublicAddress === 1 ) ?
            <ListItem className={classes.listItem}>
              <CustomDropdown
                  left
                  caret={false}
                  hoverColor="black"
                  dropdownHeader="Options"
                  buttonText={
                    <img
                        src={accountProfileImage}
                        className={classes.img}
                        alt="profile"
                    />
                  }
                  buttonProps={{
                    className:
                        classes.navLink + " " + classes.imageDropdownButton,
                    color: "transparent"
                  }}
                  dropdownList={[
                    "Profile",
                    "Settings",
                    "Sign out"
                  ]}
              />
            </ListItem> :
                <ListItem className={classes.listItem}>
                  <CustomDropdown
                      left
                      caret={false}
                      hoverColor="black"
                      dropdownHeader="Options"
                      buttonText={
                        <img
                            src={artistProfileImage}
                            className={classes.img}
                            alt="profile"
                        />
                      }
                      buttonProps={{
                        className:
                            classes.navLink + " " + classes.imageDropdownButton,
                        color: "transparent"
                      }}
                      dropdownList={[
                        "Profile",
                        "Settings",
                        "Sign out"
                      ]}
                  />
                </ListItem>
        }
      </List>
  );
}

export default withRouter(HeaderLinks)
