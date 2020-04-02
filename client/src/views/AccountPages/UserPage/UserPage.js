import React, {Fragment, useEffect, useState} from "react";
import { withRouter } from 'react-router';
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
// @material-ui/icons
import CollectionsIcon from '@material-ui/icons/Collections';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import Favorite from "@material-ui/icons/Favorite";
// core components
import Button from "components/CustomButtons/Button.js";
import Footer from "components/Footer/Footer.js";
import MainContainer from "components/MainComponents/MainContainer";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import Danger from "components/Typography/Danger.js";
import { useAuth } from "context/auth";
// images
import image7 from "assets/img/weirdos/0011.jpeg";
import profileImg from "assets/img/faces/14.png";
// styles
import styles from "assets/jss/material-kit-react/views/profilePage.js";
import ImageCard from "../../../components/ImageCards/ImageCard";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Card from "@material-ui/core/Card";
import {Link, useParams} from "react-router-dom";
import ProfileImgCard from "components/ImageCards/ProfileImgCard/ProfileImgCard";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import Dashboard from "@material-ui/icons/Dashboard";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import StoreIcon from "@material-ui/icons/Store";
import BrushIcon from "@material-ui/icons/Brush";
import BurstModeIcon from "@material-ui/icons/BurstMode";
import Filter9PlusIcon from "@material-ui/icons/Filter9Plus";
import PublishIcon from "@material-ui/icons/Publish";
import web3 from "web3";

let BigNumber = require("bignumber.js");

const useStyles = makeStyles(styles);

function getSteps() {
  return ['Select ', 'Create an ad group', 'Create an ad'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown stepIndex';
  }
}

function UserPage(props) {
  const classes = useStyles();
  const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
  );

  const [glitchFees, setGlitchFees] = useState(null);
  const [tokenCard, setTokenCard] = useState(null);
  const [accountPic, setAccountPic] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [owner, setOwner] = useState(false);

  const [activeStep, setActiveStep] = React.useState(0);

  let { publicAddress } = useParams();

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
      "inputs": [],
      "name": "showCurrentGlitchFees",
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

  const {
    authTokens, setAuthTokens,
    accountAddress, setAccountAddress,
    capturedImage, setCapturedImage,
    imageBlob, setImageBlob,
    inAuth, setInAuth,
    isMinting, setIsMinting
  } = useAuth();

  useEffect(() => {
    if (authTokens) {
      isOwnerHandler();
    } else {
      fetchAccountDataHandler();
      fetchAccountCollectionsHandler();
    }
  }, [owner]);

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

  const glitchFeesHandler  = async () => {
    detectEth();
    if (!INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
      console.error("Please set a mnemonic, infura key, owner, network, and contract address.");
      return
    }

    const web3 = window.web3;

    const nftContract = new web3.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" });

    const bigNumber = new BigNumber(web3.utils.toWei(glitchFees, 'ether'));

    const result = await nftContract.methods.changeGlitchFees(bigNumber).send({
      from: publicAddress,
    })
      .on('confirmation', (confirmationNumber, receipt) => {
        props.history.push("/");
      })
      .on('error', (err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  const isOwnerHandler = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_API}/accounts/${accountAddress}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(resData => {
        setOwner(resData.account.isArtist);
        fetchAccountDataHandler();
        fetchAccountCollectionsHandler();
      })
      .catch(err => {
        fetchAccountDataHandler();
        fetchAccountCollectionsHandler();
      })
  };

  const fetchAccountDataHandler = () => {
    fetch(`https://api.opensea.io/api/v1/accounts?address=${publicAddress}`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(resData => {
          //let [key, value] = Object.entries(resData);
          setAccountName(resData.accounts[0].user.username);
          setAccountPic(resData.accounts[0].profile_img_url);
        })
        .catch(err => {
          //setAccountName(publicAddress);
          setAccountPic(profileImg);
        })
  };

  const fetchAccountCollectionsHandler = () => {
    fetch(`https://api.opensea.io/api/v1/assets?owner=${publicAddress}&asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&limit=100`, {
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
                    size="lg">
                    View All
                  </Button>
                </Link>
              </div>
            )
          } else {
            for (let [key, value] of Object.entries(resData)) {
              setTokenCard(value.map(token => {
                return (
                  <GridItem xs={12} sm={12} md={4} lg={4} xl={4}>
                    <ProfileImgCard
                      tokenId={token.token_id}
                      faceImage={token.image_url}
                      faceName={token.name}
                      contractAddress={"0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661"}
                    />
                  </GridItem>)
              }))
            }
          }
        })
      .catch( err => {
        console.log(err);
      })
  };

  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  return (
    <>
      <MainHeader/>
      <Parallax small filter image={image7} />
      <MainContainer>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              {(accountPic === null) ?
                <div>
                  <br/>
                  <CircularProgress disableShrink/>
                </div> :
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div>
                      <img src={accountPic} alt="..." className={imageClasses} />
                    </div>
                    <div className={classes.name}>
                      <h3 className={classes.title}>{(accountName === null) ? publicAddress : accountName}</h3>
                      <br/>
                      <h5 className={classes.title}>{(accountName === null) ? " " : publicAddress}</h5>
                    </div>
                  </div>
                </GridItem>}
            </GridContainer>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={12} lg={12} xl={12} className={classes.navWrapper}>
                {(owner) ?
                  <NavPills
                    alignCenter
                    color="primary"
                    tabs={[
                      {
                        tabButton: "Collections",
                        tabIcon: CollectionsIcon,
                        tabContent: (
                          <GridContainer justify="center" spacing={1}>
                            {
                              (tokenCard === null) ?
                                <CircularProgress disableShrink /> : tokenCard
                            }
                          </GridContainer>
                        )
                      },
                      {
                        tabButton: "Fees",
                        tabIcon: AttachMoneyIcon,
                        tabContent: (
                          <>
                            <GridContainer justify="center">
                              <h5 className={classes.artBreederTitle}>Admin Only! You can here set a new value for your Glitch</h5>
                            </GridContainer>
                            <GridContainer justify="center">
                              <TextField
                                required
                                id="outlined-helperText"
                                label="New Ether Value"
                                helperText="Set value on Ether"
                                variant="outlined"
                                onChange={event => {
                                  setGlitchFees(event.target.value);
                                }}
                              />
                            </GridContainer>
                            <GridContainer justify="center">
                              <GridItem xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Button
                                  color="primary"
                                  className={classes.mintBtn}
                                  round
                                  size="lg"
                                  onClick={glitchFeesHandler}
                                >
                                  Change Glitch Fees
                                </Button>
                              </GridItem>
                            </GridContainer>
                            </>
                        )
                      }
                    ]}
                  /> :
                  <GridContainer justify="center" spacing={1}>
                    {
                      (tokenCard === null) ?
                        <CircularProgress disableShrink /> : tokenCard
                    }
                  </GridContainer>
                }
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </MainContainer>
      <Footer />
    </>
  );
}

export default withRouter(UserPage);