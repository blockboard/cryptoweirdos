import React, {useEffect, useState, useRef, useCallback} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SwipeableViews from 'react-swipeable-views';
// @material-ui/icons
// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import ImageCard from "components/ImageCards/ImageCard";
import useSpinner from "components/Spinner/useSpinner";
import { useAuth } from "context/auth";
import TabPanel from "components/TabPanal/TabPanal";
import PaginationControlled from "components/PaginationControlled/PaginationControlled";
// Images
import background from "assets/img/weirdos/0046.jpeg";
import image1 from "assets/img/weirdos/01.png"
import image2 from "assets/img/weirdos/02.png"
import image3 from "assets/img/weirdos/03.png"
import image4 from "assets/img/weirdos/04.png"
import image5 from "assets/img/weirdos/05.png"
import image6 from "assets/img/weirdos/06.png"
import image7 from "assets/img/weirdos/07.png"
import image8 from "assets/img/weirdos/08.png"
// Styles
import styles from "assets/jss/material-kit-react/views/galleryPage.js";
import LandingImgCard from "../../components/ImageCards/LandingImgCard/LandingImgCard";
import useGallery from "./useGallery";

const useStyles = makeStyles(styles);

export default function GalleryPage(props) {
  const classes = useStyles();

  const [tokenCard, setTokenCard] = useState(null);
  const [offset, setOffset] = useState(0);
  const [firstTime, setFirstTime] = useState(true);

  const { authTokens,setAuthTokens, accountAddress, setAccountAddress, totalSupply, setTotalSupply } = useAuth();

  const [overlay, setOverlay] = useState(true);
  const [spinner, showSpinner, hideSpinner] = useSpinner(overlay);

  const { inAuth, setInAuth } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();

    if (inAuth) {
      showSpinner();
    } else {
      hideSpinner();
    }

    return function cleanup() {
      abortController.abort();
    }
  }, [inAuth]);
    /*return () => {
        // Fetching TotalSupply
        fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x55a2525a0f4b0caa2005fb83a3aa3ac95683c661`, {
          method: 'GET'
        })
          .then(res => res.json())
          .then(resData => {
            console.log("from return", resData.result);
            setTotalSupply(resData.result);
          })
      }*/

  const {
    tokens,
    hasMore,
    loading,
    error
  } = useGallery(offset);

  const observer = useRef();
  const lastTokenElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + 20);
      }
    });
    if (node) observer.current.observe(node)
  }, [loading, hasMore]);


  return (
      <>
        <MainHeader/>
        {spinner}
        <Parallax small filter image={background} />
        <MainContainer>
          <div className={classes.section}>
            <GridContainer justify="left" spacing="1">
              {
                (tokens.map((token, index) => {
                  if (tokens.length === index + 1) {
                    return (
                        <GridItem key={token.tokenId} xs={12} sm={6} md={4} lg={4} xl={4}>
                          <div ref={lastTokenElementRef}>
                            {(token.ownerName === "CryptoWeirdos") ?
                              <LandingImgCard
                                accountAddress={token.ownerAddress}
                                tokenId={token.tokenId}
                                faceImage={token.image}
                                faceName={token.imageName}
                                ownerImage={token.ownerImage}
                                ownerName={token.ownerName}
                                faceDate={""}
                                imagePrice="0.1"
                                contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                                // TODO: image price
                              /> :
                              <ImageCard
                                accountAddress={token.ownerAddress}
                                tokenId={token.tokenId}
                                faceImage={token.image}
                                faceName={token.imageName}
                                ownerImage={token.ownerImage}
                                ownerName={token.ownerName}
                                faceDate={""}
                                imagePrice="0.1"
                                contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                                // TODO: image price
                                // TODO: Handle image date
                              />
                            }
                          </div>
                        </GridItem>
                    )
                  } else {
                    return (
                      <GridItem key={token.tokenId} xs={12} sm={6} md={4} lg={4} xl={4}>
                        {(token.ownerName === "CryptoWeirdos") ?
                          <LandingImgCard
                            accountAddress={token.ownerAddress}
                            tokenId={token.tokenId}
                            faceImage={token.image}
                            faceName={token.imageName}
                            ownerImage={token.ownerImage}
                            ownerName={token.ownerName}
                            faceDate={""}
                            imagePrice="0.1"
                            contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                            // TODO: image price
                          /> :
                          <ImageCard
                            accountAddress={token.ownerAddress}
                            tokenId={token.tokenId}
                            faceImage={token.image}
                            faceName={token.imageName}
                            ownerImage={token.ownerImage}
                            ownerName={token.ownerName}
                            faceDate={""}
                            imagePrice="0.1"
                            contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                            // TODO: image price
                            // TODO: Handle image date
                          />
                        }
                      </GridItem>
                    )
                  }
                }))
              }
            </GridContainer>
            <GridContainer justify="center">
              {
                (loading) ?
                  <div className={classes.loading}>
                    <CircularProgress disableShrink />
                  </div>:
                  null
              }
            </GridContainer>
          </div>
        </MainContainer>
        <Footer />
        {/*<Paper className={classes.root}>
                <Tabs
                    value={value}
                    onChange={handleChangeIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                  <Tab label="All"/>
                  <Tab label="First Generation"/>
                  <Tab label="Second Generation"/>
                </Tabs>
                <SwipeableViews
                    //axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0}>
                    <GridContainer justify="center" spacing={1}>
                      {(tokenCard === null) ?
                          <CircularProgress disableShrink /> : tokenCard}
                    </GridContainer>
                  </TabPanel>
                  <TabPanel value={value} index={1} >
                    <GridContainer justify="center" spacing={1}>
                      {(tokenCard === null) ?
                          <CircularProgress disableShrink /> : tokenCard}
                    </GridContainer>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <GridContainer justify="center" spacing={1}>
                      <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                        <img className={classes.img} src={image1}/>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                        <img className={classes.img} src={image2}/>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                        <img className={classes.img} src={image3}/>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                        <img className={classes.img} src={image6}/>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                        <img className={classes.img} src={image5}/>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                        <img className={classes.img} src={image8}/>
                      </GridItem>
                      <GridContainer justify="center">
                        <h1 className={classes.title}>In development...</h1>
                      </GridContainer>
                    </GridContainer>
                  </TabPanel>
                </SwipeableViews>
              </Paper>*/}
      </>
  );
}