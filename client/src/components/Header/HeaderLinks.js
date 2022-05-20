/*eslint-disable*/
import React, {useEffect, useState} from "react";
import Web3 from "web3";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';

// core components
import Button from "components/CustomButtons/Button.js";
import { useAuth } from "context/auth";
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import {Icon} from "@material-ui/core";
import MetaMaskIcon from "assets/img/svgs/metamask.svg";


const useStyles = makeStyles(styles);

function HeaderLinks(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const { authTokens,setAuthTokens, accountAddress, setAccountAddress, setInAuth} = useAuth();

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
      </List>
  );
}

export default withRouter(HeaderLinks)
