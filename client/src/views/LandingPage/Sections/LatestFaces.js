import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Avatar from '@material-ui/core/Avatar';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import styles from "assets/jss/material-kit-react/views/landingPageSections/latestFacesStyles.js";
import image1 from "assets/img/faces/cf1.jpeg";
import image2 from "assets/img/faces/cf2.jpeg";
import image3 from "assets/img/faces/cf3.jpeg";
import image4 from "assets/img/faces/cf4.jpeg";

import team1 from "assets/img/faces/s+avatar.jpg";

const useStyles = makeStyles(styles);

export default function LatestFaces(props) {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.section}>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={8}>
                        <h2 className={classes.title}>Latest Cryptofaces</h2>
                    </GridItem>
                </GridContainer>
            </div>
            <div className={classes.container}>
                <GridContainer spacing={2}>
                    <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    component="img"
                                    image={image1}
                                    title="Contemplative Reptile"
                                />
                                <CardContent className={classes.mediaContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Lizard
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardHeader
                                className={classes.mediaContent}
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        <img src={team1} alt="..."/>
                                    </Avatar>
                                }
                                title="Albert"
                                subheader="September 14, 2020"
                            />
                            <CardActions>
                                <IconButton aria-label="add to favorites" className={classes.loveIcon}>
                                    <FavoriteBorderIcon/>
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    component="img"
                                    image={image2}
                                    title="Contemplative Reptile"
                                />
                                <CardContent className={classes.mediaContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Lizard
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardHeader
                                className={classes.mediaContent}
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        <img src={team1} alt="..."/>
                                    </Avatar>
                                }
                                title="Albert"
                                subheader="September 14, 2020"
                            />
                            <CardActions>
                                <IconButton aria-label="add to favorites" className={classes.loveIcon}>
                                    <FavoriteBorderIcon/>
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    component="img"
                                    image={image3}
                                    title="Contemplative Reptile"
                                />
                                <CardContent className={classes.mediaContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Lizard
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardHeader
                                className={classes.mediaContent}
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        <img src={team1} alt="..."/>
                                    </Avatar>
                                }
                                title="Albert"
                                subheader="September 14, 2020"
                            />
                            <CardActions>
                                <IconButton aria-label="add to favorites" className={classes.loveIcon}>
                                    <FavoriteBorderIcon/>
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    component="img"
                                    image={image4}
                                    title="Contemplative Reptile"
                                />
                                <CardContent className={classes.mediaContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Lizard
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardHeader
                                className={classes.mediaContent}
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        <img src={team1} alt="..."/>
                                    </Avatar>
                                }
                                title="Albert"
                                subheader="September 14, 2020"
                            />
                            <CardActions>
                                <IconButton aria-label="add to favorites" className={classes.loveIcon}>
                                    <FavoriteBorderIcon/>
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        </div>
    );
}
