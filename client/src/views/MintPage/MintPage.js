import React, {useState, useEffect, useRef} from "react";
import web3 from "web3";
import ipfs from 'ipfs';
// nodejs library that concatenates classes
import classNames from "classnames";
import { useAuth } from "context/auth";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from '@material-ui/lab/Alert';
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import Favorite from "@material-ui/icons/Favorite";
// core components
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
// Images
import background from "assets/img/faces/cf7.jpeg";
// Styles
import styles from "assets/jss/material-kit-react/views/mintPage.js";
import {Link, Redirect} from "react-router-dom";
import Spinner from "components/Spinner/Spinner";
import useSpinner from "components/Spinner/useSpinner";

//const HDWalletProvider = require("truffle-hdwallet-provider");

const useStyles = makeStyles(styles);

const dashboardRoutes = ["/"];

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CreatePage(props) {
  // TODO: Redirect issue

  const classes = useStyles();
  const { ...rest } = props;

  const [finished, setFinished] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [spinner, showSpinner, hideSpinner] = useSpinner(overlay);

  const {
    authTokens, setAuthTokens,
    accountAddress, setAccountAddress,
    capturedImage, setCapturedImage,
    imageBlob, setImageBlob
  } = useAuth();

  let canvasRef = useRef(null);
  let tokenId;
  let canvas, ctx, img, width, height, bitmapData, buf, buf8, data;

  const MNEMONIC = process.env.REACT_APP_MNEMONIC;
  const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
  const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;
  const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS;
  const NETWORK = process.env.REACT_APP_NETWORK;
  const NUM_CREATURES = 1;

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
      "payable": false,
      "stateMutability": "nonpayable",
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
/*
  // Fetching TotalSupply
  fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x55a2525a0f4b0caa2005fb83a3aa3ac95683c6611`, {
    method: 'GET'
  })
    .then(res => res.json())
    .then(resData => {
      setTotalSupply(parseInt(resData.result));
    });
 */
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

  useEffect(async () => {
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

    if (width < 1000){
      let scale = width/560;
      width = 560;
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
    showSpinner();
    if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
      console.error("Please set a mnemonic, infura key, owner, network, and contract address.");
      return
    }

    const web3 = window.web3;

    const nftContract = new web3.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" });

    const minterAccount = await web3.eth.getAccounts();
    const minter = minterAccount[0];
    const result = await nftContract.methods.mintTo(minter).send({ from: minter });
    console.log("Transaction's Hash: " + result.transactionHash);

    const transferEvent = await nftContract.getPastEvents('Transfer', {});
    console.log(`${transferEvent[0].returnValues}`);
    tokenId = transferEvent[0].returnValues.tokenId;

    sendTokenMetaData(tokenId);
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

  const sendTokenMetaData = (tokenId) => {
    console.log(`In IPFS`);

    //Usage example:
    const file = dataURLtoFile(capturedImage,'image.png');
    console.log(file);

    const IReader = new window.FileReader();
    IReader.readAsArrayBuffer(file);
    IReader.onloadend = () => {
      const buffer = Buffer(IReader.result);

      ipfs.files.add(Buffer(buffer), function (err, files) {
        if (err) {
          throw err
        }

        let url = "https://ipfs.io/ipfs/"+files[0].hash;
        console.log("Storing file on IPFS using Javascript. HASH: https://ipfs.io/ipfs/"+files[0].hash);

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
            hideSpinner();
            console.log(`Result: ${res}`);
            setFinished(true);
          })
          .catch(err => {
            console.log(err);
          });
      });
    };
  };

  return (
    <>
      {spinner}
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <div className={classes.section}>
            <GridContainer justify="center" spacing={2}>
              {(authTokens === null) ?
                <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Alert
                      severity="warning"
                    >
                      This a demo! You've first to sign-in and select your weirdo to be able to mint it.
                    </Alert>
                </GridItem> :
                null}
              <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
                <canvas
                  ref={canvasRef}/>
              </GridItem>
            </GridContainer>
            <GridContainer justify="center" spacing={3}>
              {/*<GridItem xs={12} sm={12} md={3} lg={3} xl={3}>
                <Link to="/create">
                  <Button
                    color="transparent"
                    className={classes.cancelBtn}
                    round
                    size="lg"
                  >
                    Cancel
                  </Button>
                </Link>
              </GridItem>*/}
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
                  </Button> : <Button
                    color="primary"
                    className={classes.mintBtn}
                    round
                    size="lg"
                    onClick={mintWeirdo}
                  >
                    Mint Your Weirdo
                  </Button>}
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}


