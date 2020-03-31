import React, {useEffect, useRef, useState} from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import {createBrowserHistory} from "history";
import web3 from "web3";
import ipfs from 'ipfs';
//@material-ui/core
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CardMedia from "@material-ui/core/CardMedia";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import ButtonBase from '@material-ui/core/ButtonBase';
import Slide from "@material-ui/core/Slide";
//core-components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger.js";
import { useAuth } from "context/auth";
import useSpinner from "components/Spinner/useSpinner";
//styles
import styles from "assets/jss/material-kit-react/components/glitches";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import {Link, withRouter, Redirect} from "react-router-dom";
import weirdo from "assets/img/weirdos/0001.jpeg";
import MuiAlert from "@material-ui/lab/Alert";


const useDialogeStyles = makeStyles(theme => ({
  form: {
    margin: 'auto',
    width: '100%',
  },
  formBtn: {
    position: "center"
  },
  formControl: {
    cursor: "pointer",
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const StyledCardMedia = withStyles({
  media: {
    height: "auto",
  }
})(CardMedia);

const history = createBrowserHistory();

const useButtonStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
  },
  image: {
    position: 'relative',
    height: 500,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 500,
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15,
      },
      '& $imageMarked': {
        opacity: 0,
      },
      '& $imageTitle': {
        border: '4px solid currentColor',
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Glitch(props) {
  let img = props.faceImage;

  let canvasRef = useRef(null);
  let capturedRef = useRef(null);

  let canvas, ctx;
  let canvas2, ctx2;

  let width, height;

  let bitmapData, animation;

  let counter, startTime;

  let buf, buf8, data;

  let tokenId;
  let openSeaLink;

  let captured;

  const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
  const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;
  const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS;
  const NETWORK = process.env.REACT_APP_NETWORK;

  const NFT_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_proxyRegistryAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "baseURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "changeGlitchFees",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "mint",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "mintTo",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "baseTokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const savedCapturedImage = localStorage.getItem("Captured Image");

  const classes = useStyles();
  const formClasses = useDialogeStyles();
  const btnClasses = useButtonStyles();

  const [showMagnitudeComponent, setShowMagnitudeComponent] = useState(true);

  const [overlay, setOverlay] = useState(true);
  const [spinner, showSpinner, hideSpinner] = useSpinner(overlay);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const {
    authTokens, setAuthTokens,
    accountAddress, setAccountAddress,
    capturedImage, setCapturedImage,
    imageBlob, setImageBlob,
    inAuth, setInAuth,
    isMinting, setIsMinting
  } = useAuth();

  const showComponent = type => {
    const shouldShowBrokenComponent = type === "alpha-blended";
    if (shouldShowBrokenComponent !== showMagnitudeComponent) {
      setShowMagnitudeComponent(shouldShowBrokenComponent);
    }
  };
  const onComponentChange = event => {
    showComponent(event.target.value);
  };

  const [currentImg, setCurrentImg] = useState(null);
  const [captureImg, setCaptureImg] = useState();

  const [mintMsg, setMintMsg] = useState(false);
  const [minted, setMinted] = useState(false);

  const [token, setToken] = useState();

  // algorithms
  const [algorithm, setAlgorithm] = useState(null);

  // variables states
  const [horizontalIncrement, setHorizontalIncrement] = useState(-1);
  const [verticalIncrement, setVerticalIncrement] = useState(-1);
  const [threshold, setThreshold] = useState(10);
  const [magnitude, setMagnitude] = useState(0.2);

  // comparator states
  const [comparator, setComparator] = useState(null);

  const [classicModal, setClassicModal] = useState(false);
  const [capturedModel, setCapturedModel] = useState(false);
  const [tokenCard, setTokenCard] = useState(null);

  const images = [
    {
      url: weirdo,
      title: 'Select Your Weirdo',
      width: '100%',
    }
  ];

  const savedPublicAddress = localStorage.getItem("Public Address");
  const savedToken = localStorage.getItem("JWT");

  useEffect(() => {
    if (
      (savedToken !== "null") &&
      (savedToken !== null) &&
      (savedToken !== undefined)
    ) {
      setAuthTokens(savedToken, false);
      setAccountAddress(savedPublicAddress, false);
    }

    if ((currentImg !== null) && (capturedImage === null)) {
      canvas = canvasRef.current;
      ctx = canvas.getContext("2d");
      window.load = init();
    }

    if (capturedImage !== null) {
      canvas2 = capturedRef.current;
      ctx2 = canvas2.getContext("2d");
      window.load = initCaptured();
    }
  }, [algorithm, horizontalIncrement, verticalIncrement, threshold, magnitude, comparator, currentImg, capturedImage]);

  const detectEth = async () => {
    if (window.ethereum) {
      window.web3 = new web3(window.ethereum);
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  };

  function init() {
    img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = currentImg;
    img.onload = imageReady;
    counter = 0;
    startTime = Date.now();
  }

  function imageReady() {
    width = img.width;
    height = img.height;
    if(width < 1000){
     let scale = width/500;
      width = 500;
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

    start();
  }

  function start() {
    iterate();

    //drawing functions
    bitmapData.data.set(buf8);
    ctx.putImageData(bitmapData, 0, 0);

    //counter functions for benchmark testing
    counter++;
    if(counter == 20){
      let curTime = Date.now();
      //alert(curTime - startTime);
    }

    //tell the program to run again next time it's convenient
    animation = window.requestAnimationFrame(start);
  }

  const initCaptured = () => {
    img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = capturedImage;
    img.onload = imageReadyCaptured
  };

  const imageReadyCaptured = () => {
    width = img.width;
    height = img.height;

    if (width < 1000){
      let scale = width/560;
      width = 560;
      height = height/scale;
    }
    canvas2.width = width;
    canvas2.height = height;

    ctx2.drawImage(img, 0, 0, width, height);

    bitmapData = ctx2.getImageData(0, 0, width, height);
    //prepare ArrayBuffer and typed arrays
    buf = new ArrayBuffer(bitmapData.data.length);
    buf8 = new Uint8ClampedArray(buf);
    data = new Uint32Array(buf);

    buf8.set(bitmapData.data);
  };

  function iterate() {
    if (algorithm === null)
      return 0;

    switch(algorithm){
      case 0:
        iterateAlphaBlended();
        break;
      case 1:
        iterateHardSort();
        break;
    }
  }

  // algorithms
  function iterateAlphaBlended () {
    let curPix;
    let nexPix;

    for(let x = 0; x < width; x++){
      for(let y = 0; y < height; y++){
        curPix = getPixel(x, y);
        nexPix = getPixel(x + horizontalIncrement, y + verticalIncrement);
        //compare using compare() function
        if(compare(curPix) > compare(nexPix) + threshold){
          //blend pixels and set
          let blendedValue = blend(curPix, nexPix, magnitude);
          setPixel(x + horizontalIncrement, y + verticalIncrement, blendedValue);
          setPixel(x, y, blendedValue);
        }
      }
    }
  }

  function iterateHardSort (){
    let curPix;
    let nexPix;
    let startY = 0;
    let startX = 0;
    let endY = height - verticalIncrement;
    let endX = width - horizontalIncrement;

    if(verticalIncrement < 0){
      startY = Math.abs(verticalIncrement);
    }

    if(horizontalIncrement < 0){
      startX = Math.abs(horizontalIncrement);
    }

    for(let y = 0; y < endY; y++){
      for(let x = 0; x < endX; x++){

        curPix = getPixel(x, y);
        nexPix = getPixel(x + horizontalIncrement, y + verticalIncrement);

        if(!nexPix){
          break;
        }

        if(compare(curPix) > compare(nexPix) + threshold){
          setPixel(x + horizontalIncrement, y + verticalIncrement, curPix);
          setPixel(x, y, nexPix);
        }

      }

    }
  }

  // tools
  function blend(v1, v2, weight) {
    let output = [0,0,0,255];
    let rgba1 = convert32to8(v1);
    let rgba2 = convert32to8(v2);
    for(let i = 0; i < 3; i++){
      output[i] = rgba1[i] * weight + rgba2[i] * (1 - weight);
    }
    return convert8to32(output);
  }

  function convert32to8(rgba) {
    let red 	= 	rgba >>> 0	& 0xFF;
    let green 	= 	rgba >>> 8	& 0xFF;
    let blue 	= 	rgba >>> 16	& 0xFF;
    return [red, green, blue, 255];
  }

  function convert8to32(rgba) {
    let output;
    output =
      (255		<<  24) |	//alpha
      (rgba[2] 	<<  16) |	//b
      (rgba[1] 	<< 8) |		//g
      (rgba[0]	<< 0);		//r
    return output;
  }

  function setPixel(x, y, rgba) {
    data[y * width + x] = rgba;
  }

  function getPixel(x, y) {
    return data[y * width + x];
  }

  // comparators
  function brightness(rgba) {
    //console.log(`8. I'm in brightness()`);
    //gets brightness of pixel
    let red = 	rgba >>> 16	& 0xFF;
    let green = rgba >>> 8	& 0xFF;
    let blue = 	rgba 	 	& 0xFF;
    return (red + green + blue);
  }

  function hue(rgba) {
    let red = 	rgba >>> 16	& 0xFF;
    let green = rgba >>> 8	& 0xFF;
    let blue = 	rgba 	 	& 0xFF;

    let min = Math.min(red, green, blue);
    let max = Math.max(red, green, blue);

    let hue = 0;

    if(max == red){
      hue = (green - blue) / (max - min);
    } else if (max == green){
      hue = 2.0 + (blue - red) / (max - min);
    } else{
      hue = 4.0 + (red - green) / (max - min);
    }

    return hue*100;
  }

  function saturation(rgba) {
    let red = 	rgba >>> 16	& 0xFF;
    let green = rgba >>> 8	& 0xFF;
    let blue = 	rgba 	 	& 0xFF;

    let max = Math.max(red, green, blue);
    let min = Math.min(red, green, blue);

    let saturation = 0;

    if((min + max) / 2 < 0.5){
      saturation = (max - min) / (max + min);
    } else{
      saturation = (max - min) / (2.0 - max - min);
    }

    return saturation*750;
  }

  function color(rgba) {
    let red = 	rgba >>> 16	& 0xFF;
    let green = rgba >>> 8	& 0xFF;
    let blue = 	rgba 	 	& 0xFF;

    let max = Math.max(red, green, blue);
    let min = Math.min(red, green, blue);

    let saturation = 0;

    if((min + max) / 2 < 0.5){
      saturation = (max - min) / (max + min);
    } else{
      saturation = (max - min) / (2.0 - max - min);
    }

    let hue = 0;

    if(max == red){
      hue = (green - blue) / (max - min);
    } else if (max == green){
      hue = 2.0 + (blue - red) / (max - min);
    } else{
      hue = 4.0 + (red - green) / (max - min);
    }

    return hue*saturation*750;
  }

  // helpers
  function compare(rgba) {
    if (comparator === null)
      return 0;

    switch(comparator){
      case 0:
        return brightness(rgba);
        break;
      case 1:
        return hue(rgba);
        break;
      case 2:
        return saturation(rgba);
        break;
      case 3:
        return color(rgba);
        break;
      default:
        //alert("Error: no comparator selected");
        return;
    }
  }

  // actions
  function reload() {
    counter = 0;
    startTime = Date.now();

    console.log(`In reload ${ctx}`);

    ctx.drawImage(img, 0, 0, width, height);
    bitmapData = ctx.getImageData(0, 0, width, height);

    //prepare ArrayBuffer and typed arrays
    buf = new ArrayBuffer(bitmapData.data.length);
    buf8 = new Uint8ClampedArray(buf);
    data = new Uint32Array(buf);
    buf8.set(bitmapData.data);
  }
  function save() {
    setCapturedImage(canvas.toDataURL("image/png"));
    const capturedImageBlob = canvas.toBlob((blob) => {
      return URL.createObjectURL(blob);
    });
    setImageBlob(canvas);
    setCapturedModel(true);
  }

  const mintWeirdo = async () => {
    detectEth();
    showSpinner();

    if (!INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
      console.error("Please set a mnemonic, infura key, owner, network, and contract address.");
      return
    }

    const web3 = window.web3;

    const nftContract = new web3.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" });

    const minterAccount = await web3.eth.getAccounts();
    const minter = minterAccount[0];
    setIsMinting(true);
    console.log('In Phase (1): Mint');
    const transferEvent = await nftContract.methods.mintTo(minter)
      .send({
      from: minter,
      value: web3.utils.toWei("0.015", "ether")
    })
      .on('confirmation', function(confirmationNumber, receipt){
        if (confirmationNumber === 1) {
          console.log('In confirmation (1)');
          sendTokenMetaData(transferEvent.events.Transfer.returnValues.tokenId);
          openOnOpenSea(transferEvent.events.Transfer.returnValues.tokenId);
        }
      })
      .on('error', (err) => {
        if (err) {
          console.log('Error In MetaMask');
          console.log(err);
          console.log('============================================================================');
          hideSpinner();
          setIsMinting(false);
        }
      });

    /*console.log('In Phase (2): TokenId');
    await nftContract.getPastEvents('Transfer', {})
      .then(transferEvent => {
        tokenId = transferEvent[0].returnValues.tokenId;

      })
      .catch(err => {
        console.log(err);
      })*/

    //
  };

  const sendTokenMetaData = (tokenId) => {
    console.log(tokenId);
    setToken(tokenId);
    console.log('============================================================================');

    //Usage example:
    const file = dataURLtoFile(capturedImage,'image.png');

    const IReader = new window.FileReader();
    IReader.readAsArrayBuffer(file);
    IReader.onloadend = () => {
      const buffer = Buffer(IReader.result);

      ipfs.files.add(Buffer(buffer), function (err, files) {
        console.log('In Phase (3): IPFS');

        if (err) {
          console.log('Error In IPFS');
          console.log(err);
          console.log('============================================================================');
          setIsMinting(false);
        }

        let url = "https://ipfs.io/ipfs/"+files[0].hash;
        console.log("Storing file on IPFS using Javascript. HASH: https://ipfs.io/ipfs/"+files[0].hash);
        console.log('============================================================================');

        fetch(`${process.env.REACT_APP_BACKEND_API}/tokens/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tokenId: tokenId,
            image: url,
            name: `GlitchedWeirdo #${tokenId}`
          }),
        })
          .then(res => {
            console.log('In Phase (4): In Backend');
            console.log('============================================================================');

            hideSpinner();
            setMinted(true);
            setMintMsg(true);
            setIsMinting(false);
          })
          .catch(err => {
            console.log('Error In Backend');
            console.log('============================================================================');
            setIsMinting(false);
            console.log(err);
          });
      });
    };
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
  };

  const cancel = () => {
    setMinted(false);
    setMintMsg(false);
    setCapturedImage(null);
    setCapturedModel(false);
  };

  const fetchAccountCollectionsHandler = () => {
    fetch(`https://api.opensea.io/api/v1/assets?owner=${accountAddress}&asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&limit=100`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.assets[0] === undefined  || resData.assets.length == 0) {
          setTokenCard(
            <div>
              <Danger>
                No Collections, go and pick your Weirdo.
              </Danger>
              <Link to="/gallery" className={classes.linkColor}>
                <Button
                  simple
                  color="facebook"
                  size="lg"
                  className={formClasses.formBtn}>
                  View All
                </Button>
              </Link>
            </div>
          )
        } else {
          for (let [key, value] of Object.entries(resData)) {
            setTokenCard(value.map(token => {
              return (
                <GridContainer justify="center" spacing={1}>
                  <GridItem xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Card className={classes.root}>
                      <StyledCardMedia
                        className={classes.imgMedia}
                        component="img"
                        image={token.image_url}
                        title={token.name}
                        onClick={() => {
                          setCurrentImg(token.image_url);
                          setClassicModal(false);
                        }}
                      />
                    </Card>
                  </GridItem>
                </GridContainer>)
            }))
          }
        }
        setClassicModal(true);
      })
  };

  const openOnOpenSea = (tokenId) => {
    openSeaLink = `https://opensea.io/assets/${NFT_CONTRACT_ADDRESS}/${tokenId}`
    return openSeaLink;
  };

  return (
    <>
      <div className={classes.section}>
        <GridContainer justify="center" spacing="1">
          <GridItem xs={12} sm={12} md={7} lg={7} xl={6}>
            {((currentImg === null) && (authTokens !== null)) ?
              <Alert
                severity="warning"
              >
                You have first to select your weirdo to be able to glitch.
              </Alert> :
              null
            }
            <h5 className={classes.artBreederTitle}>Select the algorithm and comparator: </h5>
            <GridItem xs={12} sm={12} md={4} lg={4} xl={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Algorithms:</FormLabel>
                <RadioGroup aria-label="gender" name="position">
                  <FormControlLabel
                    value="alpha-blended"
                    control={
                      (currentImg === null) ?
                        <Radio
                          disabled
                          value="alpha-blended"
                          color="primary"
                          name="algorithm"
                          checked={algorithm === 0}
                        /> :
                        <Radio
                          value="alpha-blended"
                          color="primary"
                          name="algorithm"
                          checked={algorithm === 0}
                          onChange={() => setAlgorithm(0)}
                        />
                    }
                    label="Crypto Algo I"
                    labelPlacement="end"
                    className={classes.formColor}
                  />
                  <FormControlLabel
                    value="hard-sort"
                    control={
                      (currentImg === null) ?
                        <Radio
                          disabled
                          value="hard-sort"
                          color="primary"
                          name="algorithm"
                          checked={algorithm === 1}
                        /> :
                        <Radio
                          value="hard-sort"
                          color="primary"
                          name="algorithm"
                          checked={algorithm === 1}
                          onChange={() => setAlgorithm(1)}
                        />
                    }
                    label="Crypto Algo II"
                    labelPlacement="end"
                    className={classes.formColor}
                  />
                </RadioGroup>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={4} lg={4} xl={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Comparator:</FormLabel>
                <RadioGroup aria-label="gender" name="position">
                  <FormControlLabel
                    value="brightness"
                    control={
                      (algorithm === null) ?
                        <Radio
                          disabled
                          color="primary"
                          name="comparator"
                          checked={comparator === 0}
                          onChange={() => setComparator(0)}
                        /> :
                        <Radio
                          color="primary"
                          name="comparator"
                          checked={comparator === 0}
                          onChange={() => setComparator(0)}
                        />
                    }
                    label="Brightness"
                    labelPlacement="end"
                    className={classes.formColor}
                  />
                  <FormControlLabel
                    value="hue"
                    control={
                      (algorithm === null) ?
                        <Radio
                          disabled
                          color="primary"
                          name="comparator"
                          checked={comparator === 1}
                          onChange={() => setComparator(1)}
                        /> :
                        <Radio
                          color="primary"
                          name="comparator"
                          checked={comparator === 1}
                          onChange={() => setComparator(1)}
                        />
                    }
                    label="Hue"
                    labelPlacement="end"
                    className={classes.formColor}
                  />
                  <FormControlLabel
                    value="saturation"
                    control={
                      (algorithm === null) ?
                        <Radio
                          disabled
                          color="primary"
                          name="comparator"
                          checked={comparator === 2}
                          onChange={() => setComparator(2)}
                        /> :
                        <Radio
                          color="primary"
                          name="comparator"
                          checked={comparator === 2}
                          onChange={() => setComparator(2)}
                        />
                    }
                    label="Saturation"
                    labelPlacement="end"
                    className={classes.formColor}
                  />
                  <FormControlLabel
                    value="color"
                    control={
                      (algorithm === null) ?
                        <Radio
                          disabled
                          color="primary"
                          name="comparator"
                          checked={comparator === 3}
                          onChange={() => setComparator(3)}
                        /> :
                        <Radio
                          color="primary"
                          name="comparator"
                          checked={comparator === 3}
                          onChange={() => setComparator(3)}
                        />
                    }
                    label="Color"
                    labelPlacement="end"
                    className={classes.formColor}
                  />
                </RadioGroup>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={4} lg={4} xl={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Variables:</FormLabel>
                {(comparator === null) ?
                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Horizontal Increment:
                    <Slider
                      disabled
                      track={false}
                      defaultValue={horizontalIncrement}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      min={-3}
                      max={3}
                      onChangeCommitted={(event, value) => {
                        setHorizontalIncrement(value);
                      }}
                    />
                  </Typography> :
                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Horizontal Increment: {horizontalIncrement}
                    <Slider
                      track={false}
                      valueLabelDisplay="auto"
                      defaultValue={horizontalIncrement}
                      aria-labelledby="discrete-slider"
                      step={1}
                      marks
                      min={-3}
                      max={3}
                      onChangeCommitted={(event, value) => {
                        setHorizontalIncrement(value);
                      }}
                    />
                  </Typography>}

                {(comparator === null) ?
                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Vertical Increment:
                    <Slider
                      disabled
                      track={false}
                      defaultValue={verticalIncrement}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={-3}
                      max={3}
                      onChangeCommitted={(event, value) => {
                        setVerticalIncrement(value);
                      }}
                    />
                  </Typography> :
                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Vertical Increment: {verticalIncrement}
                    <Slider
                      track={false}
                      valueLabelDisplay="auto"
                      defaultValue={verticalIncrement}
                      aria-labelledby="discrete-slider"
                      step={1}
                      marks
                      min={-3}
                      max={3}
                      onChangeCommitted={(event, value) => {
                        setVerticalIncrement(value);
                      }}
                    />
                  </Typography>}

                {(comparator === null) ?
                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Threshold:
                    <Slider
                      disabled
                      defaultValue={threshold}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      min={1}
                      max={200}
                      onChangeCommitted={(event, value) => {
                        setThreshold(value);
                      }}
                    />
                  </Typography> :
                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Threshold: {threshold}
                    <Slider
                      defaultValue={threshold}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      min={1}
                      max={200}
                      onChangeCommitted={(event, value) => {
                        setThreshold(value);
                      }}
                    />
                  </Typography> }

                {(algorithm === 0) ?
                  (comparator === null) ?
                    <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                      Magnitude:
                      <Slider
                        disabled
                        defaultValue={magnitude}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={0.01}
                        min={0}
                        max={1}
                        onChangeCommitted={(event, value) => {
                          setMagnitude(value);
                          console.log(magnitude);
                        }}
                      />
                    </Typography> :
                    <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                      Magnitude: {magnitude}
                      <Slider
                        defaultValue={magnitude}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={0.01}
                        min={0}
                        max={1}
                        onChangeCommitted={(event, value) => {
                          setMagnitude(value);
                          console.log(magnitude);
                        }}
                      />
                    </Typography> : ""}
              </FormControl>
            </GridItem>
          </GridItem>
          <GridItem xs={12} sm={12} md={5} lg={5} xl={6}>
            {
              (authTokens === null) ?
                <div>
                  {images.map(image => (
                  <ButtonBase
                    disabled
                    focusRipple
                    key={image.title}
                    className={btnClasses.image}
                    focusVisibleClassName={btnClasses.focusVisible}
                    style={{
                      width: image.width,
                    }}>
                    <span
                      className={btnClasses.imageSrc}
                      style={{
                        backgroundImage: `url(${image.url})`,
                      }}
                    />
                    <span className={btnClasses.imageBackdrop} />
                    <span className={btnClasses.imageButton}>
                      <Typography
                        component="span"
                        variant="subtitle1"
                        color="inherit"
                        className={btnClasses.imageTitle}
                      >
                        {image.title}
                        <span className={btnClasses.imageMarked} />
                      </Typography>
                    </span>
                  </ButtonBase>
                  ))}

                  <Dialog
                    fullWidth={true}
                    maxWidth={"md"}
                    open={classicModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setClassicModal(false)}
                    aria-labelledby="max-width-dialog-title"
                  >
                    <DialogTitle
                      id="max-width-dialog-title"
                      disableTypography
                      className={classes.modalHeader}
                    >
                      <IconButton
                        className={classes.modalCloseButton}
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => setClassicModal(false)}
                      >
                        <Close className={classes.modalClose} />
                      </IconButton>
                    </DialogTitle>
                    <DialogTitle >Your Weirdos</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Select your weirdo and glitch it
                      </DialogContentText>
                      <div className={formClasses.form}>
                        <div className={formClasses.formControl}>
                          {(tokenCard === null) ?
                            <CircularProgress disableShrink /> : tokenCard}
                        </div>
                      </div>
                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>
                      <Button
                        onClick={() => setClassicModal(false)}
                        color="danger"
                        simple
                        z>
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div> :
                  (currentImg === null) ?
                    <div className={btnClasses.root}>
                      {images.map(image => (
                        <ButtonBase
                          focusRipple
                          key={image.title}
                          className={btnClasses.image}
                          focusVisibleClassName={btnClasses.focusVisible}
                          style={{
                            width: image.width,
                          }}
                          onClick={() => {
                            fetchAccountCollectionsHandler();
                          }
                          }
                        >
                    <span
                      className={btnClasses.imageSrc}
                      style={{
                        backgroundImage: `url(${image.url})`,
                      }}
                    />
                          <span className={btnClasses.imageBackdrop} />
                          <span className={btnClasses.imageButton}>
                      <Typography
                        component="span"
                        variant="subtitle1"
                        color="inherit"
                        className={btnClasses.imageTitle}
                      >
                        {image.title}
                        <span className={btnClasses.imageMarked} />
                      </Typography>
                    </span>
                        </ButtonBase>
                      ))}

                      <Dialog
                        fullWidth={true}
                        maxWidth={"md"}
                        open={classicModal}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setClassicModal(false)}
                        aria-labelledby="max-width-dialog-title"
                      >
                        <DialogTitle
                          id="max-width-dialog-title"
                          disableTypography
                          className={classes.modalHeader}
                        >
                          <IconButton
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => setClassicModal(false)}
                          >
                            <Close className={classes.modalClose} />
                          </IconButton>
                        </DialogTitle>
                        <DialogTitle >Your Weirdos</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Select your weirdo and glitch it
                          </DialogContentText>
                          <div className={formClasses.form}>
                            <div className={formClasses.formControl}>
                              {(tokenCard === null) ?
                                <CircularProgress disableShrink /> : tokenCard}
                            </div>
                          </div>
                        </DialogContent>
                        <DialogActions className={classes.modalFooter}>
                          <Button
                            onClick={() => setClassicModal(false)}
                            color="danger"
                            simple
                            z>
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div> :
                    <div>
                    <canvas
                      onClick={() => setClassicModal(true)}
                      style={{cursor: "pointer"}}
                      ref={canvasRef}/>
                      <Dialog
                        fullWidth={true}
                        maxWidth={"md"}
                        open={classicModal}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setClassicModal(false)}
                        aria-labelledby="max-width-dialog-title"
                      >
                        <DialogTitle
                          id="max-width-dialog-title"
                          disableTypography
                          className={classes.modalHeader}
                        >
                          <IconButton
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => setClassicModal(false)}
                          >
                            <Close className={classes.modalClose} />
                          </IconButton>
                        </DialogTitle>
                        <DialogTitle >Your Weirdos</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Select your weirdo and glitch it
                          </DialogContentText>
                          <div className={formClasses.form}>
                            <div className={formClasses.formControl}>
                              {(tokenCard === null) ?
                                <CircularProgress disableShrink /> : tokenCard}
                            </div>
                          </div>
                        </DialogContent>
                        <DialogActions className={classes.modalFooter}>
                          <Button
                            onClick={() => setClassicModal(false)}
                            color="danger"
                            simple
                            z>
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
            }
          </GridItem>
        </GridContainer>
        <GridContainer justify="center" spacing="1">
          <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
            {(comparator === null) ?
              <Button
                disabled
                className={classes.signLink}
                round
                color="transparent"
                size="lg"
                onClick={() => reload()}>
                Reload
              </Button> :
              <Button
                className={classes.signLink}
                round
                color="transparent"
                size="lg"
                onClick={() => reload()}>
                Reload
              </Button>}
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
            {(comparator === null) ?
              <Button
                disabled
                className={classes.signInBtn}
                round
                color="primary"
                size="lg">
                Capture
              </Button> :
              <div>
                <Button
                  className={classes.signInBtn}
                  round
                  color="primary"
                  size="lg"
                  onClick={save}>
                  Capture
                </Button>
                <Dialog
                  fullWidth={true}
                  maxWidth={"md"}
                  open={capturedModel}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={() => setCapturedModel(false)}
                  aria-labelledby="max-width-dialog-title"
                >
                  {spinner}
                  <DialogTitle
                    id="max-width-dialog-title"
                    disableTypography
                    className={classes.modalHeader}
                  >
                    <IconButton
                      className={classes.modalCloseButton}
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      onClick={cancel}
                    >
                      <Close className={classes.modalClose} />
                    </IconButton>
                  </DialogTitle>
                  <DialogTitle>Mint</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Mint and Trade your Glitched Weirdo
                    </DialogContentText>
                    <div className={formClasses.form}>
                      <div className={formClasses.formControl}>
                        {(mintMsg) ?
                          <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                              <Alert
                                severity="success"
                              >
                                Your Glitched Weirdo Minted Successfully!
                              </Alert>
                            </GridItem>
                          </GridContainer> :
                          <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                              <Alert
                                severity="warning"
                              >
                                Please DON'T close tab/browser before confirmation HERE!
                                <br/>
                                One Weirdo at a time!
                              </Alert>
                            </GridItem>
                          </GridContainer>
                        }
                        <GridContainer justify="center">
                          <canvas
                            ref={capturedRef}/>
                        </GridContainer>
                        <GridContainer justify="center" spacing={3}>
                          <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Button
                                color="transparent"
                                className={classes.cancelBtn}
                                round
                                size="lg"
                                onClick={cancel}
                              >
                                Cancel
                              </Button>
                          </GridItem>
                          {(!minted) ?
                            <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
                              {(authTokens === null) ?
                                <Button
                                  disabled
                                  color="primary"
                                  className={classes.mintBtn}
                                  round
                                  size="lg"
                                  onClick={mintWeirdo}
                                >
                                  Mint Your Weirdo
                                </Button> :
                                  <Button
                                    color="primary"
                                    className={classes.mintBtn}
                                    round
                                    size="lg"
                                    onClick={mintWeirdo}
                                  >
                                    Mint Your Weirdo
                                  </Button>}
                            </GridItem> : null
                          }
                          {(minted) ?
                            <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Button
                                color="primary"
                                className={classes.mintBtn}
                                round
                                target="_blank"
                                size="lg"
                                href={`https://opensea.io/assets/${NFT_CONTRACT_ADDRESS}/${token}`}
                              >
                                View On OpenSea
                              </Button>
                            </GridItem> : null
                          }
                        </GridContainer>
                      </div>
                    </div>
                  </DialogContent>
                  <DialogActions className={classes.modalFooter}>
                    <Button
                      onClick={cancel}
                      color="danger"
                      simple
                      z>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            }
          </GridItem>
        </GridContainer>
        <GridContainer justify="center" spacing="1">
          <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>

          </GridItem>
        </GridContainer>
      </div>
    </>
  )
}

export default withRouter(Glitch);