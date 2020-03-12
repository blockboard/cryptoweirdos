import React, {useEffect, useRef, useState} from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
//@material-ui/core
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CardMedia from "@material-ui/core/CardMedia";
//core-components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button.js";
//styles
import styles from "assets/jss/material-kit-react/components/glitches";

const useStyles = makeStyles(styles);

const StyledCardMedia = withStyles({
  media: {
    height: "auto",
  }
})(CardMedia);

export default function Glitch(props) {
  const classes = useStyles();

  const [showMagnitudeComponent, setShowMagnitudeComponent] = useState(true);

  const showComponent = type => {
    const shouldShowBrokenComponent = type === "alpha-blended";
    if (shouldShowBrokenComponent !== showMagnitudeComponent) {
      setShowMagnitudeComponent(shouldShowBrokenComponent);
    }
  };
  const onComponentChange = event => {
    showComponent(event.target.value);
  };

  // algorithms
  const [algorithm, setAlgorithm] = useState(1);

  // variables states
  const [horizontalIncrement, setHorizontalIncrement] = useState(0);
  const [verticalIncrement, setVerticalIncrement] = useState(-1);
  const [threshold, setThreshold] = useState(30);
  const [magnitude, setMagnitude] = useState(0.5);

  // comparator states
  const [comparator, setComparator] = useState(0);

  // default selection
  //let comparator = COMP_BRIGHTNESS;

  let img = props.faceImage;

  let canvasRef = useRef(null);
  let canvas;
  let ctx;

  let width;
  let height;

  let bitmapData;
  let animation;

  let counter;
  let startTime;

  let buf;
  let buf8;
  let data;

  useEffect(() => {
    console.log(`1. I'm in useEffect`);
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");

    return  window.onload = init();
  }, []);

  function init() {
    console.log(`3. I'm in init()`);
    img = new Image();
    img.src = props.faceImage;
    img.onload = imageReady;
    img.crossOrigin = "Anonymous";
    counter = 0;
    startTime = Date.now();
  }

  function imageReady() {
    console.log(`4. I'm in imageReady()`);
    width = img.width;
    height = img.height;

    if (width > 1000){
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
    //console.log(`5. I'm in start()`);
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
    //console.log(`6. I'm in iterate()`);
    switch(algorithm){
      case 0:
        iterateAlphaBlended();
        break;
      case 1:
        iterateHardSort();
        break;
      default:
        console.log("Error: no algorithm selected", `\n Algorithm ${algorithm}`);
    }
  };

  // algorithms
  function iterateAlphaBlended () {
    //console.log(`7. I'm in iterateAlpha()`);
    let curPix;
    let nexPix;

    for(let x = 0; x < width; x++){
      for(let y = 0; y < height; y++){
        curPix = getPixel(x, y);
        nexPix = getPixel(x + horizontalIncrement, y + verticalIncrement);
        //compare using compare() function
        if(compare(curPix) > compare(nexPix) + threshold){
          //blend pixels and set
          var blendedValue = blend(curPix, nexPix, magnitude);
          setPixel(x + horizontalIncrement, y + verticalIncrement, blendedValue);
          setPixel(x, y, blendedValue);
        }
      }
    }
  }

  function iterateHardSort (){
    console.log("In Hard");

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
  };

  // tools
  function blend(v1, v2, weight) {
    let output = [0,0,0,255];
    let rgba1 = convert32to8(v1);
    let rgba2 = convert32to8(v2);
    for(let i = 0; i < 3; i++){
      output[i] = rgba1[i] * weight + rgba2[i] * (1 - weight);
    }
    return convert8to32(output);
  };

  function convert32to8(rgba) {
    let red 	= 	rgba >>> 0	& 0xFF;
    let green 	= 	rgba >>> 8	& 0xFF;
    let blue 	= 	rgba >>> 16	& 0xFF;
    return [red, green, blue, 255];
  };

  function convert8to32(rgba) {
    let output;
    output =
      (255		<<  24) |	//alpha
      (rgba[2] 	<<  16) |	//b
      (rgba[1] 	<< 8) |		//g
      (rgba[0]	<< 0);		//r
    return output;
  };

  function setPixel(x, y, rgba) {
    data[y * width + x] = rgba;
  };

  function getPixel(x, y) {
    return data[y * width + x];
  };

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
  };

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
  };

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

    var hue = 0;

    if(max == red){
      hue = (green - blue) / (max - min);
    } else if (max == green){
      hue = 2.0 + (blue - red) / (max - min);
    } else{
      hue = 4.0 + (red - green) / (max - min);
    }

    return hue*saturation*750;
  };

  // helpers
  function compare(rgba) {
    //console.log(`9. I'm in compare()`);
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
  };

  // actions
  function reload() {
    counter = 0;
    startTime = Date.now();

    ctx.drawImage(img, 0, 0, width, height);
    bitmapData = ctx.getImageData(0, 0, width, height);

    //prepare ArrayBuffer and typed arrays
    buf = new ArrayBuffer(bitmapData.data.length);
    buf8 = new Uint8ClampedArray(buf);
    data = new Uint32Array(buf);
    buf8.set(bitmapData.data);
  };

  function save() {
    openInNewTab(canvas.toDataURL("image/png"))
  };

  function openInNewTab(url) {
    let win = window.open(url, '_blank');
    win.focus();
  }

  return (
    <>
      <div className={classes.section}>
        <GridContainer justify="center" spacing="1">
          <GridItem xs={12} sm={12} md={7} lg={7} xl={6}>
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
                        //checked={showMagnitudeComponent}
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
                        //checked={!showMagnitudeComponent}
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
                <FormLabel component="legend">Variables:</FormLabel>
                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Horizontal Increment: {horizontalIncrement}
                    <Slider
                      track={false}
                      defaultValue={0}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={-3}
                      max={3}
                      onChangeCommitted={(event, value) => {
                        setHorizontalIncrement(event.target.value);
                      }}
                    />
                  </Typography>

                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Vertical Increment: {verticalIncrement}
                    <Slider
                      track={false}
                      defaultValue={0}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={-3}
                      max={3}
                      onChangeCommitted={(event, value) => {
                        setVerticalIncrement(event.target.value);
                      }}
                    />
                  </Typography>

                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Threshold: {threshold}
                    <Slider
                      defaultValue={30}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={200}
                      onChangeCommitted={(event, value) => {
                        setThreshold(event.target.value);
                      }}
                    />
                  </Typography>
                  <Typography id="discrete-slider" gutterBottom className={classes.sliderName}>
                    Magnitude: {magnitude}
                    <Slider
                      defaultValue={0.5}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={0.01}
                      marks
                      min={0}
                      max={1}
                      onChangeCommitted={(event, value) => {
                        setMagnitude(event.target.value);
                      }}
                    />
                  </Typography>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={4} lg={4} xl={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Comparator:</FormLabel>
                <RadioGroup aria-label="gender" name="position">
                  <FormControlLabel
                    value="brightness"
                    control={
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
          </GridItem>
          <GridItem xs={12} sm={12} md={5} lg={5} xl={6}>
            <canvas
              ref={canvasRef}/>
          </GridItem>
        </GridContainer>
        <GridContainer justify="center" spacing="1">
          <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
            <Button
              className={classes.signLink}
              round
              color="transparent"
              size="lg"
              onClick={reload}>
              Reload
            </Button>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
            <Button
              className={classes.signInBtn}
              round
              color="primary"
              size="lg"
              onClick={save}>
              Save
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    </>
  )
}