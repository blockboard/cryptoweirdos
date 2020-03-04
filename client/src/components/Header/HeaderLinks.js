/*eslint-disable*/
import React from "react";

// react components
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// @material-ui/icons

// core components
import Button from "components/CustomButtons/Button.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";

// images
import artistProfileImage from "assets/img/faces/s+.jpeg";
import accountProfileImage from "assets/img/faces/i+avatar.jpg";

import { useAuth } from "context/auth";

// styles
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();

  const { authTokens, currentPublicAddress } = useAuth();

  return (
      <List className={classes.list}>
        <listItem className={classes.listItem}>
          <Link to="/gallery" className={classes.linkColor}>
            <Button
                color="transparent"
                round
                className={classes.navLink}>
              Gallery
            </Button>
          </Link>
        </listItem>

        <listItem className={classes.listItem}>
          <Link to="/activity" className={classes.linkColor}>
            <Button
                color="transparent"
                round
                className={classes.navLink}>
              Activity
            </Button>
          </Link>
        </listItem>

        <listItem className={classes.listItem}>
          <Link to="/offers" className={classes.linkColor}>
            <Button
                href={"/"}
                color="transparent"
                round
                className={classes.navLink}>
              Offers
            </Button>
          </Link>
        </listItem>

        {/*<listItem className={classes.listItem}>
            <Button
                href={"/create"}
                color="transparent"
                round
                className={classes.navLink}>
                Create
            </Button>
        </listItem>*/}

        { (authTokens === null) ?
            <listItem className={classes.listItem}>
              <Link to="/signin" className={classes.linkColor}>
                <Button
                    color="transparent"
                    round
                    className={classes.signLink}>
                  Sign In
                </Button>
              </Link>
            </listItem> : ( currentPublicAddress === 1 ) ?
            <ListItem className={classes.listItem}>
              <CustomDropdown
                  left
                  caret={false}
                  hoverColor="black"
                  dropdownHeader="Options"
                  buttonText={
                    <img
                        src={accountProfileImage}
                        className={classes.img}
                        alt="profile"
                    />
                  }
                  buttonProps={{
                    className:
                        classes.navLink + " " + classes.imageDropdownButton,
                    color: "transparent"
                  }}
                  dropdownList={[
                    "Profile",
                    "Settings",
                    "Sign out"
                  ]}
              />
            </ListItem> :
                <ListItem className={classes.listItem}>
                  <CustomDropdown
                      left
                      caret={false}
                      hoverColor="black"
                      dropdownHeader="Options"
                      buttonText={
                        <img
                            src={artistProfileImage}
                            className={classes.img}
                            alt="profile"
                        />
                      }
                      buttonProps={{
                        className:
                            classes.navLink + " " + classes.imageDropdownButton,
                        color: "transparent"
                      }}
                      dropdownList={[
                        "Profile",
                        "Settings",
                        "Sign out"
                      ]}
                  />
                </ListItem>
        }
      </List>
  );
}
