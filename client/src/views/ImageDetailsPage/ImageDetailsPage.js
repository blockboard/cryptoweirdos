import React, {useEffect, useState, useCallback} from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

// Core components
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import MainHeader from "../../components/MainComponents/MainHeader";
import Parallax from "../../components/Parallax/Parallax";
import MainContainer from "../../components/MainComponents/MainContainer";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem.js";
import Footer from "../../components/Footer/Footer";
import Button from "components/CustomButtons/Button.js";
import background from "assets/img/weirdos/0014.jpeg";
import styles from "assets/jss/material-kit-react/views/ImageDetails";

const useStyles = makeStyles(styles);

export default function ImageDetailsPage(props) {
  const classes = useStyles();
  const [tokenCard, setTokenCard] = useState(null);

  let { tokenId } = useParams();

  const fetchTokenDataHandler = useCallback(() => {
    if(tokenId > 170 ){
      fetch(`https://api.opensea.io/api/v1/asset/0x495f947276749Ce646f68AC8c248420045cb7b5e/${tokenId}/`, {
        method: 'GET',
        headers: { 'X-API-KEY': '560248ea4c5a46ef9f02e7ef321f6ff3'}
      })
        .then(res => res.json())
        .then(token => {
          setTokenCard(
            (
              <>
                <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
                  <img className={classes.root} src={token.image_url} alt=""/>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
                  <CardContent>
                    <Typography variant="body1" color="textPrimary" component="p">
                      {token.name}
                    </Typography>
                  </CardContent>
                  {(token.description) ?
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {token.description}
                      </Typography>
                    </CardContent> :
                    null
                  }
  
                  <h6 className={classes.tokenName}>Owned By: </h6>
                  <CardHeader
                    className={classes.ownerName}
                    avatar={
                      <Avatar aria-label="recipe" className={classes.avatar}>
                        <img src={token.owner.profile_img_url} alt="..."/>
                      </Avatar>
                    }
                    title={(token.owner.user === null) ? token.owner.address : token.owner.user.username}
                    subheader={""}
                  />
                  <Button
                    className={classes.btn}
                    round
                    target="_blank"
                    color="facebook"
                    href={token.permalink}
                  >
                    View on OpenSea
                  </Button>
                </GridItem>
              </>
            )
          )
        })
        .catch(err => console.log(err));
    }else{
      fetch(`https://api.opensea.io/api/v1/asset/0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661/${tokenId}/`, {
        method: 'GET',
        headers: { 'X-API-KEY': '560248ea4c5a46ef9f02e7ef321f6ff3'}
      })
        .then(res => res.json())
        .then(token => {
          setTokenCard(
            (
              <>
                <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
                  <img className={classes.root} src={token.image_url} alt=""/>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
                  <CardContent>
                    <Typography variant="body1" color="textPrimary" component="p">
                      {token.name}
                    </Typography>
                  </CardContent>
                  {(token.description) ?
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {token.description}
                      </Typography>
                    </CardContent> :
                    null
                  }
  
                  <h6 className={classes.tokenName}>Owned By: </h6>
                  <CardHeader
                    className={classes.ownerName}
                    avatar={
                      <Avatar aria-label="recipe" className={classes.avatar}>
                        <img src={token.owner.profile_img_url} alt="..."/>
                      </Avatar>
                    }
                    title={(token.owner.user === null) ? token.owner.address : token.owner.user.username}
                    subheader={""}
                  />
                  <Button
                    className={classes.btn}
                    round
                    target="_blank"
                    color="facebook"
                    href={token.permalink}
                  >
                    View on OpenSea
                  </Button>
                </GridItem>
              </>
            )
          )
        })
        .catch(err => console.log(err));
    }

  },[classes.avatar, classes.btn, classes.ownerName, classes.root, classes.tokenName, tokenId]);

  useEffect(() => {
    fetchTokenDataHandler();
  }, [fetchTokenDataHandler]);

  return (
    <>
        <Helmet>
          <meta name="description" 
            content="Details page gives you details about every Crypto face that comes from OpenSea marketplace"/>
        </Helmet>
      <MainHeader/>
      <Parallax small filter image={background}/>
      <MainContainer>
        <div className={classes.section}>
          <GridContainer justify="center">
            {(tokenCard === null) ?
              <CircularProgress disableShrink /> : tokenCard}
          </GridContainer>
        </div>
      </MainContainer>
      <Footer/>
    </>
  );
}