import React, {useEffect, useRef} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { useAuth } from "context/auth";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import Favorite from "@material-ui/icons/Favorite";
// core components
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
// Images
import background from "assets/img/faces/cf7.jpeg";
// Styles
import styles from "assets/jss/material-kit-react/components/glitches";

const useStyles = makeStyles(styles);

export default function CreatePage(props) {
  const classes = useStyles();

  let canvasRef = useRef(null);
  let canvas, ctx, img, width, height, bitmapData, buf, buf8, data;

  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);


  const { authTokens, setAuthTokens, accountAddress, setAccountAddress, capturedImage, setThisCapturedImage} = useAuth();

  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = capturedImage;
    img.onload = imageReady
  }, []);

  function imageReady() {
    width = img.width;

    height = img.height;
    if (width > 1000){
      let scale = width/600;
      width = 600;
      height = height/scale;

    }
    canvas.width = width;

    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    bitmapData = ctx.getImageData(0, 0, width, height);
    //prepare ArrayBuffer and typed arrays
    buf = new ArrayBuffer(bitmapData.data.length);
    buf8 = new Uint8ClampedArray(buf);
    data = new Uint32Array(buf);

    buf8.set(bitmapData.data);

  }

  const mintWeirdo = () => {

  };

  return (
    <div>
      <MainHeader/>
      <Parallax small filter image={background} />
      <MainContainer>
        <div className={classes.section}>
          <GridContainer justify="center" spacing={2}>
            <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
              <canvas
                ref={canvasRef}/>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
              <Button
                color="primary"
                className={classes.signInBtn}
                round
                size="lg"
                onClick={() => mintWeirdo()}
              >
                Mint Your Weirdo
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </MainContainer>
      <Footer />
    </div>
  );
}


