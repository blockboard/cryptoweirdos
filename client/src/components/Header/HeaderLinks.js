/*eslint-disable*/
import React, {useEffect, useState} from "react";
// react components
import { Link, withRouter } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';


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
import Web3 from "web3";

const useStyles = makeStyles(styles);

function HeaderLinks(props) {
  const classes = useStyles();
  let web3;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { authTokens, setAuthTokens, accountAddress, setAccountAddress } = useAuth();

  useEffect(() => {
    /*window.addEventListener("load", async () => {

    });*/

  }, []);

  const signInMetaMaskHandler = (publicAddress) => {
    console.log(`${process.env.REACT_APP_BACKEND_API}/accounts`);
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
      `Your Signature for CryptoWeirdos: \n I am signing my one-time nonce: ${nonce}`,
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
        console.log(`Tokens: ${resData.token}`);
        setAuthTokens(resData.token);
        setAccountAddress(resData.publicAddress);
      })
      .catch(err => console.log('authenticateHandlerError: ', err));
  };

  const checkHandler = async (event) => {
    if (window.ethereum) {
      try {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const publicAddress = await web3.eth.getCoinbase();

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
          })

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
    setAuthTokens(null);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
      <List className={classes.list}>
        {/*Gallery*/}
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

        {/*Activity*/}
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

        {/*Sales*/}
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
                round={true}
                className={classes.navLink}>
                Sales
              </Button>}
          </Link>
        </listItem>

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
                round={true}
                className={classes.navLink}>
                Create
              </Button>}
          </Link>
        </listItem>

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
