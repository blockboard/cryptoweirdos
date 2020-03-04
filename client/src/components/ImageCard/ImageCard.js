import React from "react";

// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

// @material-ui/icons
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

//Core components

// Styles
import styles from "assets/jss/material-kit-react/components/imageCardStyle";

import {Link} from "react-router-dom";

const useStyles = makeStyles(styles);

export default function ImageCard(props) {
  const classes = useStyles();
  return (
      <div>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
                className={classes.media}
                component="img"
                image={props.faceImage}
                title="Contemplative Reptile"
            />
            <CardContent className={classes.mediaContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {props.faceName}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardHeader
              className={classes.mediaContent}
              avatar={
                <Link to={"/"} className={classes.linkColor}>
                  <Avatar aria-label="recipe" className={classes.avatar}>
                    <img className={classes.img} src={props.ownerImage} alt="..."/>
                  </Avatar>
                </Link>
              }
              title={props.ownerName}
              subheader={props.faceDate}
          />
          <CardActions>
            <h5>{props.imagePrice} ETH</h5>
            <IconButton aria-label="add to favorites" className={classes.loveIcon}>
              <FavoriteBorderIcon/>
              <h6>5</h6>
            </IconButton>
          </CardActions>
        </Card>
      </div>
  );
}