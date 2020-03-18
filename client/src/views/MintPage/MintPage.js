import React, {useEffect, useRef} from "react";
import web3 from "web3";
import ipfs from './ipfs'
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

const HDWalletProvider = require("truffle-hdwallet-provider");

const useStyles = makeStyles(styles);

export default function CreatePage(props) {
  const classes = useStyles();

  let canvasRef = useRef(null);
  let canvas, ctx, img, width, height, bitmapData, buf, buf8, data;

  const MNEMONIC = process.env.REACT_APP_MNEMONIC;
  const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
  const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;
  const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS;
  const NETWORK = process.env.REACT_APP_NETWORK;
  const NUM_CREATURES = 1;

  const NFT_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "mintTo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }];

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

  const mintWeirdo = async () => {
    if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
      console.error("Please set a mnemonic, infura key, owner, network, and contract address.");
      return
    }

    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`);
    const web3Instance = new web3(
      provider
    );

    const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" });

    for (let i = 0; i < NUM_CREATURES; i++) {
      const result = await nftContract.methods.mintTo(accountAddress).send({ from: accountAddress });
      console.log("Minted Glitched Alex. Transaction: " + result.transactionHash)
    }

    // Take image to ipfs
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(capturedImage);
    const buffer = Buffer(reader.result);

    ipfs.files.add(buffer, (error, result) => {
      if(error) {
        console.error(error);
        return
      }

      fetch(`${process.env.REACT_APP_BACKEND_API}/tokens/${tokenId}`, {
        method: 'POST'
      })
    })

    // store that data in server
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


