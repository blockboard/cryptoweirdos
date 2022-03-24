import React from "react";
import { makeStyles } from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import './havingproblem.css'
import  img1  from '../../../assets/img/weirdos/0011.jpeg'
import  img2  from '../../../assets/img/weirdos/0014.jpeg'
import  img3  from '../../../assets/img/weirdos/0046.jpeg'
import  img4  from '../../../assets/img/weirdos/0054.jpeg'
import  img5  from '../../../assets/img/weirdos/0016.jpeg'
import  img6  from '../../../assets/img/weirdos/0034.jpeg'
import styles from "assets/jss/material-kit-react/views/landingPageSections/latestFacesStyles.js";

const useStyles = makeStyles(styles);

export default function HavingProblem(){
    const classes = useStyles();

    const openSeaHandler = () => {
        window.open(
            "https://opensea.io/collection/crypto-weirdos",
            "_blank"
          );
    }

    return(
        <>
        <div className={classes.section}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8}>
              <h1 className={classes.title}>Choose Your Weirdo.</h1>
            </GridItem>
          </GridContainer>
        </div>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={3} md={3} lg={3} xl={3}>
            <div class="gallery">
                <img src={img1} alt='' onClick={openSeaHandler}/>
                <img src={img2} alt='' onClick={openSeaHandler}/>
                <img src={img3} alt='' onClick={openSeaHandler}/>
                <img src={img4} alt='' onClick={openSeaHandler}/>
                <img src={img5} alt='' onClick={openSeaHandler}/>
                <img src={img6} alt='' onClick={openSeaHandler}/>
            </div>
            </GridItem>
          </GridContainer>
        </div>

        </>
    )
};