import React, {useEffect, useRef, useState} from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import {createBrowserHistory} from "history";
import Web3 from "web3";
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
import GlitchesImgCard from "components/ImageCards/GlitchesImgCard/GlitchesImgCard";
//styles
import styles from "assets/jss/material-kit-react/components/glitches";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import {Link, Redirect} from "react-router-dom";
import weirdo from "assets/img/weirdos/0001.jpeg";

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

export default function Glitch(props) {
  let img = props.faceImage;

  let canvasRef = useRef(null);
  let canvas, ctx;

  let width, height;

  let bitmapData, animation;

  let counter, startTime;

  let buf, buf8, data;

  let web3;

  let captured;

  const classes = useStyles();
  const btnClasses = useButtonStyles();

  const [showMagnitudeComponent, setShowMagnitudeComponent] = useState(true);

  const {
    authTokens, setAuthTokens,
    accountAddress, setAccountAddress,
    capturedImage, setCapturedImage,
    imageBlob, setImageBlob
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

  // algorithms
  const [algorithm, setAlgorithm] = useState(null);

  // variables states
  const [horizontalIncrement, setHorizontalIncrement] = useState(0);
  const [verticalIncrement, setVerticalIncrement] = useState(-1);
  const [threshold, setThreshold] = useState(10);
  const [magnitude, setMagnitude] = useState(0.2);

  // comparator states
  const [comparator, setComparator] = useState(null);

  const [classicModal, setClassicModal] = useState(false);
  const [tokenCard, setTokenCard] = useState(null);

  const images = [
    {
      url: weirdo,
      title: 'Select Your Weirdo',
      width: '100%',
    }
  ];

  // default selection
  //let comparator = COMP_BRIGHTNESS;

  useEffect(() => {
    if (currentImg !== null) {
      canvas = canvasRef.current;
      ctx = canvas.getContext("2d");
      window.load = init();
    }
  }, [algorithm, horizontalIncrement, verticalIncrement, threshold, magnitude, comparator, currentImg]);

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
  }

  function openInNewTab(url) {
    console.log(`URL = ${url}`);
    let win = window.open(url, '_blank');
    win.focus();
  }

  const selectImgHandler = (token) => {
    setCurrentImg(token.image_url);
  };

  const signInMetaMaskHandler = (publicAddress) => {
    console.log(`${process.env.REACT_APP_BACKEND_API}/accounts`);
    fetch(`${process.env.REACT_APP_BACKEND_API}/accounts`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(res => {
        // TODO: validate Ethereum Address
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating a user failed!');
        }
        return res.json();
      })
      .then(account => {
        console.log('ACCOUNT:',account);
      })
      .catch(err => {
        console.log('ERROR', err);
      });
  };

  const signMessageHandler = async (publicAddress, nonce) => {
    const signature = await web3.eth.personal.sign(
      `I am signing my one-time nonce: ${nonce}`,
      publicAddress,
      // MetaMask will ignore the password argument here
    );
    await authenticateHandler(publicAddress, signature);
  };

  const authenticateHandler = (publicAddress, signature) => {
    console.log(`publicAddress: ${publicAddress}, \n signature: ${signature}`);

    fetch(`${process.env.REACT_APP_BACKEND_API}/auth/signin`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(res => res.json())
      .then(resData => {
        console.log(`Tokens: ${resData.token}`);
        setAuthTokens(resData.token);
        setAccountAddress(resData.publicAddress);
      })
      .catch(err => console.log('authenticateHandlerError: ', err));
  };

  const checkHandler = async (event) => {
    if (window.ethereum) {
      try {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const publicAddress = await web3.eth.getCoinbase();

        fetch(`${process.env.REACT_APP_BACKEND_API}/accounts/${publicAddress}`, {
          method: 'GET'
        })
          .then(res => {
            if (res.status === 404) {
              signInMetaMaskHandler(publicAddress);
            }
            return res.json();
          })
          .then(account => {
            signMessageHandler(account.account.publicAddress, account.account.nonce);
          })
          .catch(err => {
            console.log('checkHandlerError: ', err);
          })

      } catch (error) {
        // User denied account access...
        console.log(error);
      }
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      // TODO: output warning msg when not having metamask
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const fetchAccountCollectionsHandler = () => {
    fetch(`https://api.opensea.io/api/v1/assets?owner=${accountAddress}&asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&limit=100`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.assets[0] === undefined  || resData.assets.length == 0) {
          setTokenCard(
            <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
              <Danger>
                No Collections, go and pick your Weirdo.
              </Danger>
              <Link to="/gallery" className={classes.linkColor}>
                <Button
                  simple
                  color="facebook"
                  size="lg">
                  View All
                </Button>
              </Link>
            </GridItem>
          )
        } else {
          for (let [key, value] of Object.entries(resData)) {
            setTokenCard(value.map(token => {
              return (
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
                        console.log(token.image_url);
                      }}
                    />
                  </Card>
                </GridItem>)
            }))
          }
        }
      })
  };

  return (
    <>
      <div className={classes.section}>
        <GridContainer justify="center" spacing="1">
          <GridItem xs={12} sm={12} md={7} lg={7} xl={6}>
            <h5 className={classes.artBreederTitle}>Select the algorithm and comparator: </h5>
            <GridItem xs={12} sm={12} md={4} lg={4} xl={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Algorithms:</FormLabel>
                <RadioGroup aria-label="gender" name="position">
                  <FormControlLabel
                    value="alpha-blended"
                    control={
                      <Radio
                        value="alpha-blended"
                        color="primary"
                        name="algorithm"
                        checked={algorithm === 0}
                        onChange={() => setAlgorithm(0)}
                      />
                    }
                    label="Alpha Blended"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="hard-sort"
                    control={
                      <Radio
                        value="hard-sort"
                        color="primary"
                        name="algorithm"
                        checked={algorithm === 1}
                        onChange={() => setAlgorithm(1)}
                      />
                    }
                    label="Hard Sort"
                    labelPlacement="end"
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
            {(currentImg === null) ?
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
                      setClassicModal(true);

                      if (authTokens === null) {
                        checkHandler();
                      }
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
                  classes={{
                    root: classes.center,
                    paper: classes.modal
                  }}
                  open={classicModal}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={() => setClassicModal(false)}
                  aria-labelledby="classic-modal-slide-title"
                  aria-describedby="classic-modal-slide-description"
                >
                  <DialogTitle
                    id="classic-modal-slide-title"
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
                    <h4 className={classes.modalTitle}>Your Weirdos</h4>
                  </DialogTitle>
                  <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                  >
                    <GridContainer justify="center" spacing={1}>
                      {(tokenCard === null) ?
                        <CircularProgress disableShrink /> : tokenCard}
                    </GridContainer>
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
              </div> : <canvas
                ref={canvasRef}/>
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
              <Link
                to="/mint"
                className={classes.linkColor}
              >
                <Button
                  className={classes.signInBtn}
                  round
                  color="primary"
                  size="lg"
                  onClick={save}>
                  Capture
                </Button>
              </Link>}
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