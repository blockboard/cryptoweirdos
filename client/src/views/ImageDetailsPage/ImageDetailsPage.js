import React from "react";

// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// Core components
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

// Customized components
import MainHeader from "../../components/MainComponents/MainHeader";
import Parallax from "../../components/Parallax/Parallax";
import MainContainer from "../../components/MainComponents/MainContainer";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem.js";
import Footer from "../../components/Footer/Footer";
import Button from "components/CustomButtons/Button.js";

// Images
import background from "assets/img/faces/cf6.jpeg";
import image from "assets/img/faces/cf1.jpeg";
import team1 from "assets/img/faces/s+avatar.jpg";

// Styles
import styles from "../../assets/jss/material-kit-react/views/ImageDetails";

const useStyles = makeStyles(styles);

export default function ImageDetailsPage(props) {
    const classes = useStyles();
    return (
        <div>
            <MainHeader/>
            <Parallax small filter image={background}/>
            <MainContainer>
                <div className={classes.section}>
                    <GridContainer justify="center" spacing={3}>
                        <GridItem lg={7}>
                            <Card className={classes.root}>
                                <CardMedia
                                    className={classes.media}
                                    image={image}
                                    title="Amicia"
                                />
                            </Card>
                        </GridItem>
                        <GridItem lg={5}>
                            <Card className={classes.root}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe" className={classes.avatar}>
                                            <img src={team1} alt="..."/>
                                        </Avatar>
                                    }
                                    title="Albert"
                                    subheader="September 14, 2016"
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        This impressive paella is a perfect party dish and a fun meal to cook together with your
                                        guests. Add 1 cup of frozen peas along with the mussels, if you like.
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Button className={classes.btn} round>Default</Button>
                        </GridItem>
                    </GridContainer>
                </div>
            </MainContainer>
            <Footer/>
        </div>
    );
}
