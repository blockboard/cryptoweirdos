import React from "react";
import {Link} from "react-router-dom";
// nodejs library that concatenates classes
import { withStyles } from '@material-ui/core/styles';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
// Core components
import styles from "assets/jss/material-kit-react/components/imageCards/imageCardStyle";

const useStyles = makeStyles(styles);

const StyledCardMedia = withStyles({
  media: {
    height: "auto",
  }
})(CardMedia);

export default function ImageCard(props) {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.root}>
        <a href={`/token/${props.contractAddress}/${props.tokenId}`}>
          <Link to={`/token/${props.contractAddress}/${props.tokenId}`}>
            <StyledCardMedia
              className={classes.media}
              component="img"
              image={props.faceImage}
              title={props.faceName}
            />
          </Link>
        </a>
        <CardContent className={classes.mediaContent}>
          <Typography gutterBottom variant="h7" component="h7">
            {props.faceName}
          </Typography>
        </CardContent>

        <CardHeader
          className={classes.headerContent}
          avatar={
            <Link to={`/account/${props.accountAddress}`}>
              <Avatar aria-label="recipe" className={classes.avatar}>
                <img className={classes.img} src={props.ownerImage} alt="..."/>
              </Avatar>
            </Link>
          }
          title={props.ownerName}
          subheader={props.faceDate}
        />
        </Card>
    </>
  );
}
