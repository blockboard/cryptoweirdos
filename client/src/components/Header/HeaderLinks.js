/*eslint-disable*/
import React, {useEffect, useState} from "react";
// react components
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import history from "../../history";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
// @material-ui/icons
// core components
import Button from "components/CustomButtons/Button.js";
import useSpinner from "components/Spinner/useSpinner";
// images
import { useAuth } from "context/auth";
// styles
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import {Icon, SvgIcon} from "@material-ui/core";

import MetaMaskIcon from "assets/img/svgs/metamask.svg";
import Web3 from "web3";

const useStyles = makeStyles(styles);

function HeaderLinks(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const [overlay, setOverlay] = useState(true);
  const [spinner, showSpinner, hideSpinner] = useSpinner(overlay);

  const open = Boolean(anchorEl);

  const { authTokens,setAuthTokens, accountAddress, setAccountAddress, inAuth, setInAuth} = useAuth();

  const savedPublicAddress = localStorage.getItem("Public Address");
  const savedToken = localStorage.getItem("JWT");

  useEffect( () => {
    if (
      (savedToken !== "null") &&
      (savedToken !== null) &&
      (savedToken !== undefined)
    ) {
      setAuthTokens(savedToken, false);
      setAccountAddress(savedPublicAddress, false);
    }
  }, []);

  const signInMetaMaskHandler = (publicAddress) => {
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
      `Your Signature for CryptoWeirdos: \n I am signing my one-time nonce: ${nonce}`, publicAddress
    , (err) => {
        if (err) {
          setInAuth(false);
        }
      });
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
        setAuthTokens((resData.token).split('"').join(""), true);
        setAccountAddress((resData.publicAddress).split('"').join(""), true);
        setInAuth(false);
      })
      .catch(err => console.log('authenticateHandlerError: ', err));
  };

  const checkHandler = async (event) => {
    if (window.ethereum) {
      try {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const publicAddress = await web3.eth.getCoinbase();

        if (
          savedToken === "null" ||
          savedToken === null ||
          savedToken === undefined
        ) {
          setInAuth(true);
          fetch(`${process.env.REACT_APP_BACKEND_API}/accounts/${publicAddress}`, {
            method: 'GET'
          })
            .then(res => {
              if (res.status === 404) {
                signInMetaMaskHandler(publicAddress);
              }
              return res.json();
            })
            .then(account => {
              signMessageHandler(account.account.publicAddress, account.account.nonce);
            })
            .catch(err => {
              console.log('checkHandlerError: ', err);
            });
        }
      } catch (error) {
        // User denied account access...
        console.log(error);
      }
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      // TODO: output warning msg when not having metamask
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const handleChange = event => {
    setAuth(event.target.checked);
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const signOutHandler = () => {
    localStorage.clear();
    setAuthTokens(null, true);
    setAccountAddress(null, true);
    setAnchorEl(null);
    props.history.push("/");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToGallery = () => {
    props.history.push("/gallery")
  };

  const goToActivity = () => {
    props.history.push("/activity")
  };

  const goToOffers = () => {
    props.history.push("/offers")
  };

  const goToCreate = () => {
    props.history.push("/create")
  };

  const goToGlitched = () => {
    props.history.push("/glitched")
  };

  return (
      <List className={classes.list}>
        {/*Gallery*/}
        <listItem className={classes.listItem}>
            {(props.location.pathname === "/gallery") ? <Button
              color="transparent"
              round
              className={classes.selectedNavLink}
              onClick={goToGallery}>
              Gallery
            </Button> : <Button
              color="transparent"
              round
              className={classes.navLink}
              onClick={goToGallery}>
              Gallery
            </Button>}
        </listItem>

        {/*Glitched*/}
        {/* <listItem className={classes.listItem}>
          {(props.location.pathname === "/glitched") ? <Button
              color="transparent"
              round
              className={classes.selectedNavLink}
              onClick={goToGlitched}>
              Glitched
            </Button> :
            <Button
              color="transparent"
              round={true}
              className={classes.navLink}
              onClick={goToGlitched}>
              Glitched
            </Button>}
        </listItem> */}

        {/*Activity*/}
        {/* <listItem className={classes.listItem}>
            {(props.location.pathname === "/activity") ? <Button
              color="transparent"
              round
              className={classes.selectedNavLink}
              onClick={goToActivity}>
              Activity
            </Button> :
            <Button
              color="transparent"
              round
              className={classes.navLink}
              onClick={goToActivity}>
              Activity
            </Button>}
        </listItem> */}

        {/*Sales*/}
        {/*<listItem className={classes.listItem}>
            {(props.location.pathname === "/offers") ? <Button
                color="transparent"
                round
                className={classes.selectedNavLink}
                onClick={goToOffers}>
                Sales
              </Button> :
              <Button
                color="transparent"
                round={true}
                className={classes.navLink}
                onClick={goToOffers}>
                Sales
              </Button>}
        </listItem>*/}

        {/*Blog*/}
        {/*<listItem className={classes.listItem}>
          <Link to="/blog" className={classes.linkColor}>
            <Button
                color="transparent"
                round={true}
                className={classes.navLink}>
              Blog
            </Button>
          </Link>
        </listItem>*/}

        {/*Create*/}
        {/* <listItem className={classes.listItem}>
          {(props.location.pathname === "/create") ? <Button
              color="transparent"
              round
              className={classes.selectedNavLink}
              onClick={goToCreate}>
              create
            </Button> :
            <Button
              color="transparent"
              round={true}
              className={classes.navLink}
              onClick={goToCreate}>
              Create
            </Button>}
        </listItem> */}

        {/*SignIn*/}
        { (authTokens === null) ?
            <listItem className={classes.listItem}>
                <Button
                    className={classes.signLink}
                    round={true}
                    color="transparent"
                    size="lg"
                    onClick={checkHandler} >
                  Sign In |
                    <Icon classes={{root: classes.iconRoot}}>
                         <img className={classes.icon} src={MetaMaskIcon}/>
                    </Icon>
                </Button>
            </listItem> :
          <ListItem className={classes.listItem}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <Link to={`/account/${accountAddress}`} className={classes.linkColor}>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
              </Link>
              <MenuItem onClick={signOutHandler}>Sign Out</MenuItem>
            </Menu>
          </ListItem>
        }

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
      </List>
  );
}

export default withRouter(HeaderLinks)
