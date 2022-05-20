import React, {useEffect, useState} from "react";
import "assets/scss/material-kit-react.scss?v=1.8.0";
// react libraries
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { AuthContext } from "./context/auth";

// pages for this product
import LandingPage from "./views/LandingPage/LandingPage";
import ImageDetailsPage from "./views/ImageDetailsPage/ImageDetailsPage";
import GalleryPage from "./views/GalleryPage/GalleryPage";
import UserPage from "./views/AccountPages/UserPage/UserPage";
import NotFoundPage from "./views/NotFoundPage/NotFoundPage";

export default function App(props) {
  const [authTokens, setAuthTokens] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [inAuth, setInAuth] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isInGlitch, setIsInGlitch] = useState(false);
  const [minted, setMinted] = useState(false);
  const [inMintWindow, setInMintWindow] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    return function cleanup() {
      abortController.abort();
    }
  }, []);

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

  const setThisIsMinting = (data) => {
    localStorage.setItem("Minting", data);
    setIsMinting(data);
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

  const setThisIsInGlitch = (data) => {
    setIsInGlitch(data)
  };

  const setThisMinted = (data) => {
    setMinted(data);
  };

  const setThisInMintWindow = (data) => {
    setInMintWindow(data);
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
        setInAuth: setThisInAuth,
        isMinting,
        setIsMinting: setThisIsMinting,
        isInGlitch,
        setIsInGlitch: setThisIsInGlitch,
        minted,
        setMinted: setThisMinted,
        inMintWindow,
        setInMintWindow: setThisInMintWindow
      }}>
        <Router>
          <Switch>
            <Route exact path='/' component={LandingPage}/>
            <Route path="/gallery" component={GalleryPage}/>
            <Route path={`/account/:publicAddress`} component={UserPage}/>
            <Route path="/token/:contractAddress/:tokenId" component={ImageDetailsPage}/>
            <Route component={NotFoundPage}/>
          </Switch>
        </Router>

      </AuthContext.Provider>
  );
}
