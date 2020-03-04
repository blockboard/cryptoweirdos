import React, { Fragment } from "react";

// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";

// @material-ui/icons
import CollectionsIcon from '@material-ui/icons/Collections';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import Favorite from "@material-ui/icons/Favorite";
import Dashboard from "@material-ui/icons/Dashboard";
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import PublishIcon from '@material-ui/icons/Publish';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import BrushIcon from '@material-ui/icons/Brush';
import StoreIcon from '@material-ui/icons/Store';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus';

// core components
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";

// images
import image2 from "assets/img/faces/cf2.jpeg";
import image3 from "assets/img/faces/cf3.jpeg";
import image4 from "assets/img/faces/cf4.jpeg";
import image5 from "assets/img/faces/cf5.jpeg";
import image6 from "assets/img/faces/cf6.jpeg";
import image7 from "assets/img/faces/cf7.jpeg";
import image8 from "assets/img/faces/cf8.jpeg";
import profile from "assets/img/faces/s+.jpeg";

// styles
import styles from "assets/jss/material-kit-react/views/profilePage.js";
import {Link} from "react-router-dom";

const useStyles = makeStyles(styles);

export default function ArtistPage(props) {
  const classes = useStyles();

  const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  return (
      <Fragment>
        <MainHeader/>
        <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div>
                      <img src={profile} alt="..." className={imageClasses} />
                    </div>
                    <div className={classes.name}>
                      <h3 className={classes.title}>S+ Albert</h3>
                      <h6>ARCHITECT</h6>
                      <Button justIcon link className={classes.margin5}>
                        <i className={"fab fa-twitter"} />
                      </Button>
                      <Button justIcon link className={classes.margin5}>
                        <i className={"fab fa-instagram"} />
                      </Button>
                      <Button justIcon link className={classes.margin5}>
                        <i className={"fab fa-facebook"} />
                      </Button>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
              <div className={classes.description}>
                <p>
                  An artist of considerable range, Chet Faker — the name taken by
                  Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs
                  and records all of his own music, giving it a warm, intimate
                  feel with a solid groove structure.{" "}
                </p>
              </div>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} lg={12} xl={12} className={classes.navWrapper}>
                  <NavPills
                      color="rose"
                      horizontal={{
                        tabsGrid: { xs: 12, sm: 4, md: 2 },
                        contentGrid: { xs: 12, sm: 8, md: 8 }
                      }}
                      tabs={[
                        {
                          tabButton: "Library",
                          tabIcon: LocalLibraryIcon,
                          tabContent: (
                              <NavPills
                                  alignCenter
                                  color="primary"
                                  tabs={[
                                    {
                                      tabButton: "Collections",
                                      tabIcon: CollectionsIcon,
                                      tabContent: (
                                          <GridContainer justify="center" spacing={2}>
                                            <GridItem xs={12} sm={12} md={6}>
                                              <Link to={"/token/:tokenid"} >
                                                <Card className={classes.root}>
                                                  <CardActionArea>
                                                    <CardMedia
                                                        className={classes.media}
                                                        component="img"
                                                        image={image7}
                                                        title="Liza"
                                                    />
                                                  </CardActionArea>
                                                </Card>
                                              </Link>
                                            </GridItem>
                                            <GridItem xs={12} sm={12} md={6}>
                                              <Link to={"/token/:tokenid"} >
                                                <Card className={classes.root}>
                                                  <CardActionArea>
                                                    <CardMedia
                                                        className={classes.media}
                                                        component="img"
                                                        image={image7}
                                                        title="Liza"
                                                    />
                                                  </CardActionArea>
                                                </Card>
                                              </Link>
                                            </GridItem>
                                            <GridItem xs={12} sm={12} md={6}>
                                              <Link to={"/token/:tokenid"} >
                                                <Card className={classes.root}>
                                                  <CardActionArea>
                                                    <CardMedia
                                                        className={classes.media}
                                                        component="img"
                                                        image={image7}
                                                        title="Liza"
                                                    />
                                                  </CardActionArea>
                                                </Card>
                                              </Link>
                                            </GridItem>
                                            <GridItem xs={12} sm={12} md={6}>
                                              <Link to={"/token/:tokenid"} >
                                                <Card className={classes.root}>
                                                  <CardActionArea>
                                                    <CardMedia
                                                        className={classes.media}
                                                        component="img"
                                                        image={image7}
                                                        title="Liza"
                                                    />
                                                  </CardActionArea>
                                                </Card>
                                              </Link>
                                            </GridItem>
                                          </GridContainer>
                                      )
                                    },
                                    {
                                      tabButton: "Activity",
                                      tabIcon: LocalActivityIcon,
                                      tabContent: (
                                          <GridContainer justify="center">
                                            <GridItem xs={12} sm={12} md={6}>
                                              <img
                                                  alt="..."
                                                  src={image5}
                                                  className={navImageClasses}
                                              />
                                              <img
                                                  alt="..."
                                                  src={image6}
                                                  className={navImageClasses}
                                              />
                                              <img
                                                  alt="..."
                                                  src={image3}
                                                  className={navImageClasses}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} sm={12} md={6}>
                                              <img
                                                  alt="..."
                                                  src={image4}
                                                  className={navImageClasses}
                                              />
                                              <img
                                                  alt="..."
                                                  src={image8}
                                                  className={navImageClasses}
                                              />
                                            </GridItem>
                                          </GridContainer>
                                      )
                                    },
                                    {
                                      tabButton: "Favorite",
                                      tabIcon: Favorite,
                                      tabContent: (
                                          <GridContainer justify="center">
                                            <GridItem xs={12} sm={12} md={6}>
                                              <img
                                                  alt="..."
                                                  src={image5}
                                                  className={navImageClasses}
                                              />
                                              <img
                                                  alt="..."
                                                  src={image5}
                                                  className={navImageClasses}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} sm={12} md={6}>
                                              <img
                                                  alt="..."
                                                  src={image3}
                                                  className={navImageClasses}
                                              />
                                              <img
                                                  alt="..."
                                                  src={image4}
                                                  className={navImageClasses}
                                              />
                                              <img
                                                  alt="..."
                                                  src={image2}
                                                  className={navImageClasses}
                                              />
                                            </GridItem>
                                          </GridContainer>
                                      )
                                    }
                                  ]}
                              />
                          )
                        },
                        {
                          tabButton: "Dashboard",
                          tabIcon: Dashboard,
                          tabContent: (
                              <NavPills
                                  color="rose"
                                  horizontal={{
                                    tabsGrid: { xs: 12, sm: 4, md: 2 },
                                    contentGrid: { xs: 12, sm: 8, md: 10 }
                                  }}
                                  tabs={[
                                    {
                                      tabButton: "Mint",
                                      tabIcon: AccountBalanceIcon,
                                      tabContent: (
                                          <NavPills
                                              alignCenter
                                              color="primary"
                                              tabs={[
                                                {
                                                  tabButton: "New",
                                                  tabIcon: AddCircleIcon,
                                                  tabContent: (
                                                      <Fragment>
                                                        <input
                                                            accept="image/*"
                                                            className={classes.input}
                                                            id="contained-button-file"
                                                            multiple
                                                            type="file"
                                                        />
                                                        <label htmlFor="contained-button-file">
                                                          <Button variant="contained" color="primary" component="span">
                                                            Upload
                                                          </Button>
                                                        </label>
                                                      </Fragment>
                                                  )
                                                },
                                                {
                                                  tabButton: "Store",
                                                  tabIcon: StoreIcon,
                                                  tabContent: (
                                                      <GridContainer justify="center">
                                                        <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
                                                          <img
                                                              alt="..."
                                                              src={image5}
                                                              className={navImageClasses}
                                                          />
                                                          <img
                                                              alt="..."
                                                              src={image6}
                                                              className={navImageClasses}
                                                          />
                                                          <img
                                                              alt="..."
                                                              src={image3}
                                                              className={navImageClasses}
                                                          />
                                                        </GridItem>
                                                        <GridItem xs={12} sm={12} md={6}>
                                                          <img
                                                              alt="..."
                                                              src={image4}
                                                              className={navImageClasses}
                                                          />
                                                          <img
                                                              alt="..."
                                                              src={image8}
                                                              className={navImageClasses}
                                                          />
                                                        </GridItem>
                                                      </GridContainer>
                                                  )
                                                },
                                              ]}
                                          />
                                      )
                                    },
                                    {
                                      tabButton: "Tools",
                                      tabIcon: BrushIcon,
                                      tabContent: (
                                          <NavPills
                                              alignCenter
                                              color="primary"
                                              tabs={[
                                                {
                                                  tabButton: "Breeding",
                                                  tabIcon: BurstModeIcon,
                                                  tabContent: (
                                                      <span></span>
                                                  )
                                                },
                                                {
                                                  tabButton: "Filtering",
                                                  tabIcon: Filter9PlusIcon,
                                                  tabContent: (
                                                      <span></span>
                                                  ),
                                                }
                                              ]}
                                          />
                                      )
                                    },
                                    {
                                      tabButton: "Uploads",
                                      tabIcon: PublishIcon,
                                      tabContent: (
                                          <span></span>
                                      )
                                    }
                                  ]}
                              />
                          )
                        },
                      ]}
                  />
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <Footer />
      </Fragment>
  );
}
