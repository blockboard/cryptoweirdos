import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
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
import MainHeader from "../../components/MainComponents/MainHeader";
import MainContainer from "../../components/MainComponents/MainContainer";
import ImageCard from "../../components/ImageCard/ImageCard";
import PaginationControlled from "../../components/PaginationControlled/PaginationControlled";

// Images
import background from "assets/img/faces/cf3.jpeg";
import image1 from "assets/img/faces/cf1.jpeg";
import image2 from "assets/img/faces/cf2.jpeg";
import image3 from "assets/img/faces/cf3.jpeg";
import image4 from "assets/img/faces/cf4.jpeg";

import team1 from "assets/img/faces/s+avatar.jpg";

// Styles
import styles from "assets/jss/material-kit-react/views/galleryPage.js";

const useStyles = makeStyles(styles);

export default function GalleryPage(props) {
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
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                            <ImageCard
                                faceImage={image1}
                                faceName="Lizard"
                                ownerImage={team1}
                                ownerName="Albert"
                                faceDate="September 14, 2020"
                                imagePrice="0.5"
                            />
                        </GridItem>
                    </GridContainer>
                </div>
                <div className={classes.section}>
                    <GridContainer justify="center">
                        <GridItem xs={8} sm={7} md={5} lg={4} xl={4}>
                            <PaginationControlled/>
                        </GridItem>
                    </GridContainer>
                </div>
            </MainContainer>
            <Footer />
        </div>
    );
}
