import React, { useState } from "react";

// react libraries
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {createBrowserHistory} from "history";

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

import "assets/scss/material-kit-react.scss?v=1.8.0";

const hist = createBrowserHistory();

export default function App(props) {
  const [authTokens, setAuthTokens] = useState();
  const [currentPublicAddress, setCurrentPublicAddress] = useState(1);

  const setTokens = (data) => {
    localStorage.setItem("Tokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  const setPublicAddress = (data) => {
    localStorage.setItem("Public Address", JSON.stringify(data));
    setCurrentPublicAddress(data);
  };

  return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens, currentPublicAddress, setCurrentPublicAddress: setPublicAddress }}>
        <Router history={hist}>
          <Switch>
            <Route exact path='/' component={LandingPage}/>
            <Route path="/signup" component={SignUpPage}/>
            <Route path="/signin" component={SignInPage}/>
            <Route path="/token/:tokenId" component={ImageDetailsPage}/>
            <Route path="/gallery" component={GalleryPage}/>
            <Route path="/blog" component={BlogPage}/>
            <Route path="/account/artist" component={ArtistPage}/>
            <Route path="/account" component={UserPage}/>
            <Route component={NotFoundPage}/>
          </Switch>
        </Router>
      </AuthContext.Provider>
  );
}
