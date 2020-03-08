import React, {useEffect, useState} from "react";
// nodejs library that concatenates classes
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import ActivityImgCard from "components/ImageCards/ActivityImgCard/ActivityImgCard";
// Images
import background from "assets/img/faces/cf3.jpeg";
// Styles
import styles from "assets/jss/material-kit-react/views/activityPage.js";

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


export default function ActivityPage(props) {
  const classes = useStyles();

  const [tokenCard, setTokenCard] = useState();

  const [totalSupply, setTotalSupply] = useState(null);
  const [lastVisit, setLastVisit] = useState(80);

  const [page, setPage] = useState(31);
  const [totalPages, setTotalPages] = useState(null);
  const [per, setPer] = useState(2);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
                  <GridContainer justify="center" spacing={2}>
                    <GridItem xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ActivityImgCard
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
                    </GridItem>
                  </GridContainer>)
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
            <Paper className={classes.root}>
              <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
              >
                <Tab label="Creations"/>
                <Tab label="Offers" />
                <Tab label="Sales" />
                <Tab label="Glitches" />
                <Tab label="All" />
              </Tabs>
            </Paper>
            {/*<GridContainer justify="center">
              {(tokenCard === null) ?
                  <CircularProgress disableShrink /> : tokenCard}
            </GridContainer>*/}
          </div>
        </MainContainer>
        <Footer/>
      </>
  );
}
