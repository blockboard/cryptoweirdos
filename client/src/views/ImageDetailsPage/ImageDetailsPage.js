import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

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
  const [tokenCard, setTokenCard] = useState();

  useEffect(() => {
    fetchTokenDataHandler();
  }, []);

  let { tokenId } = useParams();

  const fetchTokenDataHandler = () => {
    fetch(`https://api.opensea.io/api/v1/asset/0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661/${tokenId}/`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(token => {
          console.log(token.collection.created_date);
          setTokenCard(
              (<GridContainer justify="center" spacing={3}>
                <GridItem lg={7}>
                  <Card className={classes.root}>
                    <CardMedia
                        className={classes.media}
                        image={token.image_url}
                        title={token.tokenid}
                    />
                  </Card>
                </GridItem>
                <GridItem lg={5}>
                  <Card className={classes.root}>
                    <CardHeader
                        avatar={
                          <Avatar aria-label="recipe" className={classes.avatar}>
                            <img src={token.owner.profile_img_url} alt="..."/>
                          </Avatar>
                        }
                        title={(token.owner.user === null) ? token.owner.address : token.owner.user.username}
                        subheader={(token.collection.created_date === null) ? "" : token.collection.created_date}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {token.description}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Button
                      className={classes.btn}
                      round
                      href={token.permalink}
                  >
                    View on OpenSea
                  </Button>
                </GridItem>
              </GridContainer>)
          )
        })
        .catch(err => console.log(err));
  };

  return (
      <div>
        <MainHeader/>
        <Parallax small filter image={background}/>
        <MainContainer>
          <div className={classes.section}>
            {tokenCard}
          </div>
        </MainContainer>
        <Footer/>
      </div>
  );
}
