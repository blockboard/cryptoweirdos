import React from "react";
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
import image1 from "assets/img/faces/cf1.jpeg";
import image2 from "assets/img/faces/cf2.jpeg";
import image3 from "assets/img/faces/cf3.jpeg";
import image4 from "assets/img/faces/cf4.jpeg";
import team1 from "assets/img/faces/s+avatar.jpg";

// Style
import styles from "assets/jss/material-kit-react/views/landingPageSections/latestFacesStyles.js";

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
                            faceImage={image2}
                            faceName="Rob"
                            ownerImage={team1}
                            ownerName="Albert"
                            faceDate="September 14, 2020"
                            imagePrice="0.1"
                        />
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                        <ImageCard
                            faceImage={image3}
                            faceName="Lizard"
                            ownerImage={team1}
                            ownerName="Albert"
                            faceDate="September 14, 2020"
                            imagePrice="0.6"
                        />
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                        <ImageCard
                            faceImage={image4}
                            faceName="Lizard"
                            ownerImage={team1}
                            ownerName="Albert"
                            faceDate="September 14, 2020"
                            imagePrice="0.5"
                        />
                    </GridItem>
                </GridContainer>
            </div>
        </div>
    );
}
