import React, {useEffect, useState} from "react";

// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import ImageCard from "components/ImageCard/ImageCard";
import PaginationControlled from "components/PaginationControlled/PaginationControlled";

// Images
import background from "assets/img/faces/cf3.jpeg";
import image1 from "assets/img/faces/cf1.jpeg";
import team1 from "assets/img/faces/s+avatar.jpg";

// Styles
import styles from "assets/jss/material-kit-react/views/galleryPage.js";

const useStyles = makeStyles(styles);

export default function GalleryPage(props) {
  const classes = useStyles();

  const [tokenCard, setTokenCard] = useState();

  const [totalSupply, setTotalSupply] = useState();
  const [lastVisit, setLastVisit] = useState(80);

  const [page, setPage] = useState(31);
  const [totalPages, setTotalPages] = useState(null);
  const [per, setPer] = useState(2);

  useEffect(() => {
    // Fetching TotalSupply
    fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x55a2525a0f4b0caa2005fb83a3aa3ac95683c661`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(resData => {
          setTotalSupply(parseInt(resData.result));
        });

    fetchLatestedBornHandler();
  }, []);

  const fetchLatestedBornHandler = async () => {
    fetch(`https://api.opensea.io/api/v1/assets/?asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&order_by=token_id&order_direction=desc&limit=100`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(resData => {
          for (let [key, value] of Object.entries(resData)) {
            setTokenCard(value.map(token => {
              return (
                  <GridItem xs={12} sm={6} md={3} lg={3} xl={3}>
                    <ImageCard
                        tokenId={token.token_id}
                        faceImage={token.image_url}
                        faceName={token.name}
                        ownerImage={token.owner.profile_img_url}
                        ownerName={ (token.owner.user === null) ? token.owner.address : token.owner.user.username}
                        faceDate={(token.collection.created_date === null) ? "" : token.collection.created_date}
                        imagePrice="0.1"
                        // TODO: image price
                        // TODO: Handle image date
                    />
                  </GridItem>)
            }))
          }
        })
        .catch(err => console.log(err));
  };

  /*const loadMoreHandler = () => {
    setLastVisit(lastVisit - 20);
    fetchLatestedBornHandler(lastVisit);
  };*/

  return (
      <>
        <MainHeader/>
        <Parallax small filter image={background} />
        <MainContainer>
          <div className={classes.section}>
            <GridContainer justify="center" spacing={1}>
              {tokenCard}
            </GridContainer>
          </div>
        </MainContainer>
        <Footer />
      </>
  );
}
