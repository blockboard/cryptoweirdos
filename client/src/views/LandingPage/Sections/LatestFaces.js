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
import LandingImgCard from "../../../components/ImageCards/LandingImgCard/LandingImgCard";

const useStyles = makeStyles(styles);

export default function LatestFaces(props) {
  const classes = useStyles();
  const [tokenCard, setTokenCard] = useState(null);

  useEffect(() => {
    fetchLatestedBornHandler();
  }, []);

  const fetchLatestedBornHandler = async () => {
    fetch('https://api.opensea.io/api/v1/assets/?asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&order_by=last_born&limit=6', {
          method: 'GET'
    })
        .then(res => res.json())
        .then(resData => {
          for (let [key, value] of Object.entries(resData)) {
            setTokenCard(value.map(token => {
              return (
                  <GridItem xs={12} sm={6} md={4} lg={4} xl={4}>
                    <LandingImgCard
                        accountAddress={token.owner.address}
                        tokenId={token.token_id}
                        faceImage={token.image_url}
                        faceName={token.name}
                        ownerImage={token.owner.profile_img_url}
                        ownerName={token.owner.user.username}
                        faceDate={token.sell_orders.created_date}
                        imagePrice="0.1"
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
              <h1 className={classes.title}> Choose Your Weirdo.</h1>
              <h2 className={classes.title}>Latest CryptoWeirdos</h2>
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
