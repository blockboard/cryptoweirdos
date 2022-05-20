import React, {useEffect, useState} from "react";
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import LandingImgCard from "components/ImageCards/LandingImgCard/LandingImgCard";
import styles from "assets/jss/material-kit-react/views/landingPageSections/latestFacesStyles.js";

const useStyles = makeStyles(styles);

export default function LastWeirdos(props) {
  const classes = useStyles();

  const [tokenCard, setTokenCard] = useState(null);

  useEffect(() => {
    fetchMostViewedHandler();
  }, []);

  const fetchMostViewedHandler = async () => {
    fetch('https://api.opensea.io/api/v1/assets?order_direction=desc&asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&limit=6', {
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
              <h2 className={classes.title} style={{marginTop:100}}>Last Weirdos</h2>
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
