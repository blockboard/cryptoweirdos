import React, {useEffect, useState} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import {makeStyles, withStyles} from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ImageCard from "components/ImageCards/ImageCard";
import Typography from '@material-ui/core/Typography';
import LandingImgCard from "components/ImageCards/LandingImgCard/LandingImgCard";
// Images
import image1 from "assets/img/faces/cf1.jpeg";
import image2 from "assets/img/faces/cf2.jpeg";
import image3 from "assets/img/faces/cf3.jpeg";
import image4 from "assets/img/faces/cf4.jpeg";
import image5 from "assets/img/faces/cf5.jpeg";
import image6 from "assets/img/faces/cf6.jpeg";
import image7 from "assets/img/faces/cf7.jpeg";
import image8 from "assets/img/faces/cf8.jpeg";


import team1 from "assets/img/s+.jpeg";
import team2 from "assets/img/faces/i+avatar.jpg";

// Style
import styles from "assets/jss/material-kit-react/views/landingPageSections/latestFacesStyles.js";

import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(styles);



export default function MostViewed(props) {
  const classes = useStyles();

  const [tokenCard, setTokenCard] = useState(null);

  useEffect(() => {
    fetchMostViewedHandler();
  }, []);

  const fetchMostViewedHandler = async () => {
    fetch('https://api.opensea.io/api/v1/assets?owner=0x7cEF4B8A78b2B64749EFA91094512Ac2f65A0B1f&order_direction=asc&asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&limit=6', {
      method: 'GET',
      headers: {Accept: 'application/json', 'X-API-KEY': '560248ea4c5a46ef9f02e7ef321f6ff3'}
    })
        .then(res => res.json())
        .then(resData => {
            setTokenCard(resData.assets.map(token => {

              return (
                  <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                    <LandingImgCard
                        accountAddress={token.owner.address}
                        tokenId={token.token_id}
                        faceImage={token.image_url}
                        faceName={token.name}
                        ownerImage={token.owner.profile_img_url}
                        ownerName={(token.owner.user === null) ? null : token.owner.user.username}
                        faceDate={(token.sell_orders === null) ? null : null}
                        imagePrice="0.1"
                        contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                        // TODO: image price
                    />
                  </GridItem>)
            }))
        })
        .catch(err => console.log(err));
  };


  return (
      <>
        <div className={classes.section}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8}>
              <h2 className={classes.title} style={{marginTop:100}}>For sale</h2>
            </GridItem>
          </GridContainer>
        </div>
        <div className={classes.container}>
          <GridContainer justify="center" spacing={1}>
            {(tokenCard === null) ?
                <CircularProgress disableShrink /> : tokenCard}
          </GridContainer>
        </div>
      </>
  );
}
