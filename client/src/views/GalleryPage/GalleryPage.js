import React, {useEffect, useState, useRef, useCallback} from "react";
import { Helmet } from "react-helmet-async";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import ImageCard from "components/ImageCards/ImageCard";
import useSpinner from "components/Spinner/useSpinner";
import { useAuth } from "context/auth";
import background from "assets/img/weirdos/0046.jpeg";
import styles from "assets/jss/material-kit-react/views/galleryPage.js";
import LandingImgCard from "../../components/ImageCards/LandingImgCard/LandingImgCard";
import useGallery from "./useGallery";

const useStyles = makeStyles(styles);

export default function GalleryPage(props) {
  const classes = useStyles();

  const [offset, setOffset] = useState(0);
  const [overlay] = useState(true);
  const [spinner, showSpinner, hideSpinner] = useSpinner(overlay);

  const { inAuth } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();

    if (inAuth) {
      showSpinner();
    } else {
      hideSpinner();
    }

    return function cleanup() {
      abortController.abort();
    }
  }, [inAuth, hideSpinner, showSpinner]);

  const {
    tokens,
    hasMore,
    loading,
  } = useGallery(offset);

  const observer = useRef();
  const lastTokenElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + 20);
      }
    });
    if (node) observer.current.observe(node)
  }, [loading, hasMore]);


  return (
      <>
        <Helmet>
          <meta name="description" 
            content="Gallery displays all our CryptoWeirdos NFTs that comes from OpenSea marketplace"/>
        </Helmet>

        <MainHeader/>
        {spinner}
        <Parallax small filter image={background} />
        
        <MainContainer>
          <div className={classes.section}>
            <GridContainer justify="left" spacing="1">
              {
                (tokens.map((token, index) => {
                  if (tokens.length === index + 1) {
                    return (
                        <GridItem key={token.tokenId} xs={12} sm={6} md={4} lg={4} xl={4}>
                          <div ref={lastTokenElementRef}>
                            {(token.ownerName === "CryptoWeirdos") ?
                              <LandingImgCard
                                accountAddress={token.ownerAddress}
                                tokenId={token.tokenId}
                                faceImage={token.image}
                                faceName={token.imageName}
                                ownerImage={token.ownerImage}
                                ownerName={token.ownerName}
                                faceDate={""}
                                imagePrice="0.1"
                                contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                              /> :
                              <ImageCard
                                accountAddress={token.ownerAddress}
                                tokenId={token.tokenId}
                                faceImage={token.image}
                                faceName={token.imageName}
                                ownerImage={token.ownerImage}
                                ownerName={token.ownerName}
                                faceDate={""}
                                imagePrice="0.1"
                                contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                              />
                            }
                          </div>
                        </GridItem>
                    )
                  } else {
                    return (
                      <GridItem key={token.tokenId} xs={12} sm={6} md={4} lg={4} xl={4}>
                        {(token.ownerName === "CryptoWeirdos") ?
                          <LandingImgCard
                            accountAddress={token.ownerAddress}
                            tokenId={token.tokenId}
                            faceImage={token.image}
                            faceName={token.imageName}
                            ownerImage={token.ownerImage}
                            ownerName={token.ownerName}
                            faceDate={""}
                            imagePrice="0.1"
                            contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                          /> :
                          <ImageCard
                            accountAddress={token.ownerAddress}
                            tokenId={token.tokenId}
                            faceImage={token.image}
                            faceName={token.imageName}
                            ownerImage={token.ownerImage}
                            ownerName={token.ownerName}
                            faceDate={""}
                            imagePrice="0.1"
                            contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                          />
                        }
                      </GridItem>
                    )
                  }
                }))
              }
            </GridContainer>
            <GridContainer justify="center">
              {
                (loading) ?
                  <div className={classes.loading}>
                    <CircularProgress disableShrink />
                  </div>:
                  null
              }
            </GridContainer>
          </div>
        </MainContainer>
        <Footer />
      </>
  );
}