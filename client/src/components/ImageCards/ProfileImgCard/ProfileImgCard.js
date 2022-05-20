import React from "react";
import {Link} from "react-router-dom";
// @material-ui/core components
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

//Core components
import styles from "assets/jss/material-kit-react/components/imageCards/profileCardStyle";

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
