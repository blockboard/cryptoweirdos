import React, {useEffect, useState} from "react";
import useSpinner from "components/Spinner/useSpinner";
// react libraries
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import history from "./history";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { AuthContext } from "./context/auth";
import PrivateRoute from './PrivateRoute';
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage";
import SignUpPage from "./views/AuthenticationPages/SignUpPage/SignUpPage";
import SignInPage from "./views/AuthenticationPages/SignInPage/SignInPage";
import ImageDetailsPage from "./views/ImageDetailsPage/ImageDetailsPage";
import GalleryPage from "./views/GalleryPage/GalleryPage";
import ArtistPage from "./views/AccountPages/ArtistPage/ArtistPage";
import UserPage from "./views/AccountPages/UserPage/UserPage";
import NotFoundPage from "./views/NotFoundPage/NotFoundPage";
import BlogPage from "./views/BlogPage/BlogPage";
import SalesPage from "./views/SalesPage/SalesPage";
import ActivityPage from "./views/ActivityPage/ActivityPage";

import "assets/scss/material-kit-react.scss?v=1.8.0";
import CreatePage from "./views/CreatePage/CreatePage";
import MintPage from "./views/MintPage/MintPage";

export default function App(props) {
  const [authTokens, setAuthTokens] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [inAuth, setInAuth] = useState(false);


  const setTokens = (data, notExists) => {
    if (notExists) {
      localStorage.setItem("JWT", data);
    }
    setAuthTokens(data);
  };

  const setPublicAddress = (data, notExists) => {
    if (notExists) {
      localStorage.setItem("Public Address", data);
    }
    setAccountAddress(data);
  };

  const setThisCapturedImage = (data) => {
    setCapturedImage(data);
  };

  const setThisImageBlob = (data) => {
    setImageBlob(data);
  };

  const setThisTotalSupply = (data) => {
    setTotalSupply(data);
  };

  const setThisInAuth = (data) => {
    setInAuth(data);
  };


  return (
      <AuthContext.Provider value={{
        authTokens,
        setAuthTokens: setTokens,
        accountAddress,
        setAccountAddress: setPublicAddress,
        capturedImage,
        setCapturedImage: setThisCapturedImage,
        imageBlob,
        setImageBlob: setThisImageBlob,
        totalSupply,
        setTotalSupply: setThisTotalSupply,
        inAuth,
        setInAuth: setThisInAuth
      }}>
          <Switch>
            <Route exact path='/' component={LandingPage}/>
            <Route path="/gallery" component={GalleryPage}/>
            <Route path="/activity" component={ActivityPage}/>
            <Route path="/offers" component={SalesPage}/>
            <Route path="/create" component={CreatePage}/>
            <PrivateRoute path="/mint" component={MintPage}/>
            <Route path={`/account/:publicAddress`} component={UserPage}/>
            <Route path="/token/:tokenId" component={ImageDetailsPage}/>
            <Route component={NotFoundPage}/>
          </Switch>
      </AuthContext.Provider>
  );
}
