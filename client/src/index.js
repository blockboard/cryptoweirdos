import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.8.0";

// pages for this product
import Components from "views/Components/Components.js";
import LandingPage from "views/LandingPage/LandingPage.js";
import UserPage from "./views/UserPage/UserPage.js";
import SignUpPage from "./views/AuthenticationPages/SignUpPage/SignUpPage.js";
import GalleryPage from "./views/GalleryPage/GalleryPage";
import ImageDetailsPage from "./views/ImageDetailsPage/ImageDetailsPage";
import LoginPage from "./views/AuthenticationPages/LoginPage/LoginPage";
import CreatePage from "./views/CreatePage/CreatePage";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
        <Route path="/signup" component={SignUpPage}/>
        <Route path="/login" component={LoginPage}/>
        <Route path="/token/100001" component={ImageDetailsPage}/>
        <Route path="/gallery" component={GalleryPage}/>
        <Route path="/create" component={CreatePage}/>
        <Route path="/account" component={UserPage}/>
        <Route path="/" component={LandingPage}/>
    </Switch>
  </Router>,
  document.getElementById("root")
);
