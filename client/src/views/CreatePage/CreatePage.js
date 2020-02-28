import React from "react";

// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import Favorite from "@material-ui/icons/Favorite";

// core components
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import ImageCard from "components/ImageCard/ImageCard";
import PaginationControlled from "components/PaginationControlled/PaginationControlled";

// Images
import background from "assets/img/faces/cf7.jpeg";
import image1 from "assets/img/faces/cf1.jpeg";
import image2 from "assets/img/faces/cf2.jpeg";
import image3 from "assets/img/faces/cf3.jpeg";
import image4 from "assets/img/faces/cf4.jpeg";
import team1 from "assets/img/faces/s+avatar.jpg";

// Styles
import styles from "assets/jss/material-kit-react/views/createPage.js";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const useStyles = makeStyles(styles);

export default function CreatePage(props) {
    const classes = useStyles();
    const imageClasses = classNames(
        classes.imgRaised,
        classes.imgRoundedCircle,
        classes.imgFluid
    );
    const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
    return (
        <div>
            <MainHeader/>
            <Parallax small filter image={background} />
            <MainContainer>
                <div className={classes.section}>
                    <GridContainer justify="center" spacing={2}>
                        <GridItem xs={12} sm={6} md={4} lg={4} xl={6}>
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
                                            Mint
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={4} lg={4} xl={6}>
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
                                            Portraits
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
            </MainContainer>
            <Footer />
        </div>
    );
}
