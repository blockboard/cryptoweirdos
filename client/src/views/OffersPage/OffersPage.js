import React, {useEffect, useState} from "react";
import Web3 from "web3";
// nodejs library that concatenates classes
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import ActivityImgCard from "components/ImageCards/OfferImgCard/OfferImgCard";
// Images
import background from "assets/img/weirdos/0011.jpeg";
// Styles
import styles from "assets/jss/material-kit-react/views/activityPage.js";
import OfferImgCard from "../../components/ImageCards/OfferImgCard/OfferImgCard";

// @material-ui/icons

const useStyles = makeStyles(styles);

// TODO: Fixed Tabs

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <Typography
          component="div"
          role="tabpanel"
          hidden={value !== index}
          id={`scrollable-auto-tabpanel-${index}`}
          aria-labelledby={`scrollable-auto-tab-${index}`}
          {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}


export default function OffersPage(props) {
  const classes = useStyles();

  const [tokenCard, setTokenCard] = useState(null);

  const [totalSupply, setTotalSupply] = useState(null);
  const [lastVisit, setLastVisit] = useState(80);

  const [page, setPage] = useState(31);
  const [totalPages, setTotalPages] = useState(null);
  const [per, setPer] = useState(2);

  const [value, setValue] = useState(0);

  const web3 = new Web3(window.ethereum);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchLatestedBornHandler();
  }, []);

  const fetchLatestedBornHandler = async () => {
    fetch(`https://api.opensea.io/api/v1/events?asset_contract_address=0x55a2525A0f4B0cAa2005fb83A3Aa3AC95683C661&event_type=created&only_opensea=true&limit=20`, {
      method: 'GET',
    })
        .then(res => res.json())
        .then(resData => {
          console.log(`Data: ${resData.asset_events.length}`);

          for (let [key, value] of Object.entries(resData)) {
            setTokenCard(value.map(token => {
              if (token.asset === null) {
                return 0;
              }
              return (
                  <GridItem xs={12} sm={6} md={12} lg={12} xl={12}>
                    <OfferImgCard
                        key={token.id}
                        accountAddress={token.asset.owner.address}
                        tokenId={token.asset.token_id}
                        faceImage={token.asset.image_url}
                        faceName={token.asset.name}
                        ownerImage={token.asset.owner.profile_img_url}
                        ownerName={token.asset.owner.user.username}
                        faceDate={token.asset.collection.created_date}
                        openSeaLink={token.asset.permalink}
                        imagePrice={web3.utils.fromWei(token.starting_price, 'ether')}
                        // TODO: image price
                    />
                  </GridItem>)
            }))
            /*setTokenCard( () => {
              for (let i=0; i<resData.asset_events.length; i++) {
                if (resData.asset_events[i].asset === null) {
                  break;
                }
                console.log('i = ', i + resData.asset_events[i]);

                return(<>
                  <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OfferImgCard
                        accountAddress={resData.asset_events[i].asset.owner.address}
                        tokenId={resData.asset_events[i].asset.token_id}
                        faceImage={resData.asset_events[i].asset.image_url}
                        faceName={resData.asset_events[i].asset.name}
                        ownerImage={resData.asset_events[i].asset.owner.user.username}
                        ownerName={(resData.asset_events[i].asset.owner.user.username === null) ? resData.asset_events[i].asset.owner.address : resData.asset_events[i].asset.owner.user.username}
                        faceDate={(resData.asset_events[i].asset.collection.created_date === null) ? "" : resData.asset_events[i].asset.collection.created_date}
                        imagePrice="0.1"
                        // TODO: image price
                        // TODO: Handle image date
                    />
                  </GridItem>
                </>)
              }
            })*/
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
            {(tokenCard === null) ?
                <GridContainer justify="center"><br/><CircularProgress disableShrink/></GridContainer>: tokenCard}
          </div>
        </MainContainer>
        <Footer/>
      </>
  );
}
