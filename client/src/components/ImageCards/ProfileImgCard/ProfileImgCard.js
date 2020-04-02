import React from "react";

// nodejs library that concatenates classes
import classNames from "classnames";
import { withStyles } from '@material-ui/core/styles';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";

// @material-ui/icons

//Core components

// Styles
import styles from "assets/jss/material-kit-react/components/imageCards/profileCardStyle";

import {Link, Redirect} from "react-router-dom";
import {CardActions} from "@material-ui/core";

const useStyles = makeStyles(styles);

const StyledCardMedia = withStyles({
  media: {
    height: "auto",
  }
})(CardMedia);

export default function ProfileImgCard(props) {
  const classes = useStyles();
  return (
      <div>
        <Card className={classes.root}>
          <Link to={`/token/${props.contractAddress}/${props.tokenId}`}>
            <StyledCardMedia
                className={classes.media}
                component="img"
                image={props.faceImage}
                title={props.faceName}
            />
          </Link>
        </Card>
      </div>
  );
}
