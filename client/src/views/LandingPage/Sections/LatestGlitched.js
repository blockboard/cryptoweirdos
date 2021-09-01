import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ImageCard from "components/ImageCards/ImageCard";
import Button from "components/CustomButtons/Button.js";
// Style
import styles from "assets/jss/material-kit-react/views/landingPageSections/latestFacesStyles.js";
import LandingImgCard from "components/ImageCards/LandingImgCard/LandingImgCard";

const useStyles = makeStyles(styles);

export default function LatestGlitched(props) {
  const classes = useStyles();
  const [tokenCard, setTokenCard] = useState(null);

  const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;

  useEffect(() => {
    fetchLatestedBornHandler();
  }, []);

  const fetchLatestedBornHandler = async () => {
    fetch(`https://api.opensea.io/api/v1/assets/?asset_contract_address=${NFT_CONTRACT_ADDRESS}&order_by=pk&limit=3`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(resData => {
        for (let [key, value] of Object.entries(resData)) {
          setTokenCard(value.map(token => {
            console.log(token)
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
                  contractAddress={NFT_CONTRACT_ADDRESS}
                  // TODO: image price
                />
              </GridItem>)
          }))
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h2 className={classes.title}>Latest Glitched Weirdos</h2>
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
            <Link to={"/create"} className={classes.linkColor}>
              <Button
                className={classes.signLink}
                simple
                color="facebook"
                size="lg">
                Create
              </Button>
            </Link>
          </GridItem>
        </GridContainer>
      </div>
    </>
  );
}
