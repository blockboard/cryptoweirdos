import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
// Core components
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
// Customized components
import MainHeader from "../../components/MainComponents/MainHeader";
import Parallax from "../../components/Parallax/Parallax";
import MainContainer from "../../components/MainComponents/MainContainer";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem.js";
import Footer from "../../components/Footer/Footer";
// Images
import background from "assets/img/weirdos/0014.jpeg";
// Styles
import styles from "assets/jss/material-kit-react/views/ImageDetails";

const useStyles = makeStyles(styles);

const useStylesForCard = makeStyles({
  root: {
    maxWidth: 545,
  },
});
export default function ImageDetailsPage(props) {
  const classes = useStyles();
  const classesForCard = useStylesForCard()

  const [tokenCard, setTokenCard] = useState(null);

  useEffect(() => {
    fetchTokenDataHandler();
  }, []);

  let { contractAddress, tokenId } = useParams();

  const fetchTokenDataHandler = () => {
    fetch(`https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(token => {
        console.log(token.collection.created_date);
        setTokenCard(
          (
            <>
              <Card className={classesForCard.root}>
                  <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="512"
                    width="512"
                    image={token.image_url}
                    title={token.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {token.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {(token.description) ?
                        <CardContent>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {token.description}
                          </Typography>
                        </CardContent> :
                        null
                      }
                    </Typography>
                  </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    target="_blank"
                    href={token.permalink}>
                    View on OpenSea
                  </Button>
                </CardActions>
              </Card>
            </>
          )
        )
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <MainHeader />
      <Parallax small filter image={background} />
      <MainContainer>
        <div className={classes.section}>
          <GridContainer justify="center">
            {(tokenCard === null) ?
              <CircularProgress disableShrink /> : tokenCard}
          </GridContainer>
        </div>
      </MainContainer>
      <Footer />
    </>
  );
}
