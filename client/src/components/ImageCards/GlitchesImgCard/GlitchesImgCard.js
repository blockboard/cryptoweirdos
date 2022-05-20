import React from "react";
// nodejs library that concatenates classes
import { withStyles } from '@material-ui/core/styles';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

//Core components
// Styles
import styles from "assets/jss/material-kit-react/components/imageCards/profileCardStyle";

const useStyles = makeStyles(styles);

const StyledCardMedia = withStyles({
  media: {
    height: "auto",
  }
})(CardMedia);

export default function GlitchesImgCard(props) {
  const classes = useStyles();
  return (
    <div>
      <Card className={classes.root}>
          <StyledCardMedia
            className={classes.media}
            component="img"
            image={props.faceImage}
            title={props.faceName}
          />
      </Card>
    </div>
  );
}
