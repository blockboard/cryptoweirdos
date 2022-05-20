import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-kit-react/views/landingPageSections/latestFacesStyles.js";
import LandingImgCard from "components/ImageCards/LandingImgCard/LandingImgCard";

const useStyles = makeStyles(styles);

export default function RecentTransfers(props) {
  const classes = useStyles();
  const [tokenCard, setTokenCard] = useState(null);

  useEffect(() => {
    fetchLatestedBornHandler();
  }, []);

  const fetchLatestedBornHandler = async () => {
    fetch('https://api.opensea.io/api/v1/events?asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&event_type=transfer&limit=6', {
          method: 'GET',
          headers: { 'X-API-KEY': '560248ea4c5a46ef9f02e7ef321f6ff3'}
    })
        .then(res => res.json())
        .then(resData => {
            setTokenCard(resData.asset_events.map(token => {
              return (
                  <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                    <LandingImgCard
                        accountAddress={token.asset.owner.address}
                        tokenId={token.asset.token_id}
                        faceImage={token.asset.image_preview_url}
                        faceName={token.asset.name}
                        ownerImage={(token.asset.owner.profile_img_url === null) ? token.asset.owner.profile_img_url : token.asset.owner.profile_img_url}
                        ownerName={(token.asset.owner.user === null) ? null : token.asset.owner.user.username}
                        faceDate={(token.asset.sell_orders === null) ? null : null}
                        imagePrice="0.1"
                        contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                      // TODO: image price
                    />
                  </GridItem>)
            }
            ))
        })
        .catch(err => console.log(err));
  };

  return (
      <>
        <div className={classes.section}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8}>
              <h1 className={classes.title}>Choose Your Weirdo.</h1>
              <h2 className={classes.title}>Recent Transfers</h2>
            </GridItem>
          </GridContainer>
        </div>
        <div className={classes.container}>
          <GridContainer justify="center" spacing={1}>
            {(tokenCard === null) ?
                <CircularProgress disableShrink /> : tokenCard}
          </GridContainer>
          <GridContainer justify="center">
            <GridItem xs={12} sm={3} md={3} lg={3} xl={3}>
              <Link to={"/gallery"} className={classes.linkColor}>
                <Button
                    className={classes.signLink}
                    simple
                    color="facebook"
                    size="lg">
                  View All
                </Button>
              </Link>
            </GridItem>
          </GridContainer>
        </div>
      </>
  );
}
