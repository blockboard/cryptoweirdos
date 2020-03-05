import React, {useEffect, useState} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ImageCard from "../../../components/ImageCard/ImageCard";
import Typography from '@material-ui/core/Typography';

// Images

// Style
import styles from "assets/jss/material-kit-react/views/landingPageSections/latestFacesStyles.js";

const useStyles = makeStyles(styles);

export default function RandomSelection(props) {
  const classes = useStyles();

  const [tokenCard, setTokenCard] = useState();

  let fourTokenIds = [];

  useEffect(() => {
    fetcRandomHandler();
  }, []);

  const fetcRandomHandler = () => {
    fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x55a2525a0f4b0caa2005fb83a3aa3ac95683c661`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(resData => {
          let totalSupplyNum = resData.result;
          while (!(fourTokenIds.length == 4)) {
            let x = Math.floor(Math.random() * totalSupplyNum) + 1;
            if (!fourTokenIds.includes(x)) {
              fourTokenIds.push(x);
            }
          }
          fetch(`https://api.opensea.io/api/v1/assets/?token_ids=${fourTokenIds[0]}&token_ids=${fourTokenIds[1]}&token_ids=${fourTokenIds[2]}&token_ids=${fourTokenIds[3]}&asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661`, {
            method: 'GET'
          })
              .then(res => res.json())
              .then(resData => {
                for (let [key, value] of Object.entries(resData)) {
                  setTokenCard(value.map(token => {
                    return (
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                          <ImageCard
                              faceImage={token.image_url}
                              faceName={token.name}
                              ownerImage={token.owner.profile_img_url}
                              ownerName={token.owner.user.username}
                              faceDate={token.sell_orders.created_date}
                              imagePrice="0.1"
                          />
                        </GridItem>)
                  }))
                }
              })
              .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
  };

  // TODO: Error Handling

  return (
      <>
        <div className={classes.section}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8}>
              <h2 className={classes.title}>Choose Your Weirdo</h2>
            </GridItem>
          </GridContainer>
        </div>
        <div className={classes.container}>
          <GridContainer justify="center" spacing={1}>
            {tokenCard}
          </GridContainer>
        </div>
      </>
  );
}
