import React from "react";
import { withStyles } from '@material-ui/core/styles';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

//Core components
import styles from "assets/jss/material-kit-react/components/imageCards/landingCardStyle";

const useStyles = makeStyles(styles);

const StyledCardMedia = withStyles({
    media: {
        height: "auto",
    }
})(CardMedia);

export default function LandingImgCard(props) {
    const classes = useStyles();
    return (
        <div>
            <Card className={classes.root}>
                <a href={`/token/${props.contractAddress}/${props.tokenId}`}>
                    <StyledCardMedia
                        className={classes.media}
                        component="img"
                        image={props.faceImage}
                        title={props.faceName}
                    />
                </a>
                <CardContent className={classes.mediaContent}>
                    <Typography gutterBottom variant="h7" component="h7">
                        {props.faceName}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}