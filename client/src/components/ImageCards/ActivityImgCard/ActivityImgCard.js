import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { withStyles } from '@material-ui/core/styles';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
// @material-ui/icons
//Core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
// Styles
import styles from "assets/jss/material-kit-react/components/imageCards/activityCardStyle";

import {Link, Redirect} from "react-router-dom";

import Web3 from "web3";

const useStyles = makeStyles(styles);

const StyledCardMedia = withStyles({
  media: {
    height: "250px",
    width: "250px"
  }
})(CardMedia);

export default function ActivityImgCard(props) {
  const classes = useStyles();

  return (
      <>
        <GridContainer justify="center" spacing="1">
          <GridItem xs={12} sm={12} md={5} lg={5} xl={5}>
              <a href={`/token/${props.tokenId}`}>
                <StyledCardMedia
                    className={classes.media}
                    component="img"
                    image={props.faceImage}
                    title={props.faceName}
                />
              </a>
          </GridItem>
          <GridItem xs={12} sm={12} md={2} lg={2} xl={2}>
            <div className={classes.root}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography gutterBottom variant="h6" component="h7">
                      {props.faceName}
                    </Typography>
                    <h6>Sold</h6>
                    <h5>{props.imagePrice} ETH</h5>
                  </GridItem>
                </GridContainer>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={2} lg={2} xl={2}>
            <div className={classes.root}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                  <h6>From: </h6>
                  <CardHeader
                    className={classes.headerContent}
                    avatar={
                      <a href={`/account/${props.sellerAddress}`}>
                        <Avatar aria-label="recipe" className={classes.avatar}>
                          <img className={classes.img} src={props.sellerImage} alt="..."/>
                        </Avatar>
                      </a>
                    }
                    title={props.sellerName}
                    subheader={props.faceDate}
                  />
                  <h6>To: </h6>
                  <CardHeader
                    className={classes.headerContent}
                    avatar={
                      <a href={`/account/${props.ownerAddress}`}>
                        <Avatar aria-label="recipe" className={classes.avatar}>
                          <img className={classes.img} src={props.ownerImage} alt="..."/>
                        </Avatar>
                      </a>
                    }
                    title={props.ownerName}
                    subheader={props.faceDate}
                  />

                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={3} lg={3} xl={3}>
            <div className={classes.root}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                    className={classes.signLink}
                    href={props.openSeaLink}
                    target="_blank"
                    simple
                    color="facebook"
                    size="lg">
                    View on OpenSea
                  </Button>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
        </GridContainer>
      </>
  );
}
