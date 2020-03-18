import React, {useEffect, useState} from "react";

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

const useStyles = makeStyles(styles);

export default function GalleryPage(props) {
  const classes = useStyles();

  const [tokenCard, setTokenCard] = useState(null);

  const [totalSupply, setTotalSupply] = useState();
  const [lastVisit, setLastVisit] = useState(80);

  const [page, setPage] = useState(31);
  const [totalPages, setTotalPages] = useState(null);
  const [per, setPer] = useState(2);

  const [value, setValue] = useState(0);

  const handleChangeIndex = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // Fetching TotalSupply
    fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x55a2525a0f4b0caa2005fb83a3aa3ac95683c661`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(resData => {
          setTotalSupply(parseInt(resData.result));
        });

    fetchLatestedBornHandler();
  }, []);

  const fetchLatestedBornHandler = async () => {
    fetch(`https://api.opensea.io/api/v1/assets/?asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&order_by=token_id&order_direction=desc&limit=100`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(resData => {
          for (let [key, value] of Object.entries(resData)) {
            setTokenCard(value.map(token => {
              return (
                  <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                    <ImageCard
                        accountAddress={token.owner.address}
                        tokenId={token.token_id}
                        faceImage={token.image_url}
                        faceName={token.name}
                        ownerImage={token.owner.profile_img_url}
                        ownerName={ (token.owner.user === null) ? token.owner.address : token.owner.user.username}
                        faceDate={""}
                        imagePrice="0.1"
                        // TODO: image price
                        // TODO: Handle image date
                    />
                  </GridItem>)
            }))
          }
        })
        .catch(err => console.log(err));
  };

  /*const loadMoreHandler = () => {
    setLastVisit(lastVisit - 20);
    fetchLatestedBornHandler(lastVisit);
  };*/

  return (
      <>
        <MainHeader/>
        <Parallax small filter image={background} />
        <MainContainer>
          <div className={classes.section}>
            <GridContainer justify="center" spacing="1">
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
              {(tokenCard === null) ?
                <CircularProgress disableShrink /> : tokenCard}
            </GridContainer>
          </div>
        </MainContainer>
        <Footer />
      </>
  );
}
