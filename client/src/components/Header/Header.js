import React, {useState} from "react";
// react components
import { Link, withRouter } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
// styles
import styles from "assets/jss/material-kit-react/components/headerStyle.js";
import CardMedia from "@material-ui/core/CardMedia";
import {Paper} from "@material-ui/core";

const useStyles = makeStyles(styles);

const useAnotherStyles = makeStyles({
  elevation4: {}
}, { name: 'MuiPaper'});

function Header(props) {
  const classes = useStyles();
  const specialPaper = useAnotherStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [prevScroll, setPrevScroll] = useState();
  const [currentScroll, setCurrentScroll] = useState();
  const [visible, setVisible] = useState(true);

  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }

    /*if (props.hideOnScroll) {
      window.addEventListener("scroll", handleScroll);
    }*/

    //handleScroll();

    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }

      /*if (props.hideOnScroll) {
        window.removeEventListener("scroll", handleScroll)
      }*/
    };
  }, []);

  // Hide or show the menu.
  /*const handleScroll = () => {
    setPrevScroll(window.pageYOffset);

    console.log(`Prev, ${prevScroll}`);
    window.onscroll = () => {
      console.log(`current , ${currentScroll}`);
      setCurrentScroll(window.pageYOffset);
      if (prevScroll > currentScroll) {
        document.body
            .getElementsByTagName("header")[0]
            .classList.add(classes.hideOnScroll);
      } else {
        document.body
            .getElementsByTagName("header")[0]
            .classList.remove(classes.hideOnScroll)
      }
      //prevScroll = currentScroll;
    }
  };*/

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
          .getElementsByTagName("header")[0]
          .classList.remove(classes[color]);
      document.body
          .getElementsByTagName("header")[0]
          .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
          .getElementsByTagName("header")[0]
          .classList.add(classes[color]);
      document.body
          .getElementsByTagName("header")[0]
          .classList.remove(classes[changeColorOnScroll.color]);
    }
  };

  const { color, rightLinks, leftLinks, brand, fixed, hideOnScroll, absolute } = props;

  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed,
   /* [classes.hideOnScroll]: hideOnScroll,
    [classes.showOnScroll]: hideOnScroll*/
  });

  const brandComponent = <Link to="/" className={classes.linkColor}>
    <Button
        color="transparent"
        round
        className={classes.title}>
      {brand}
    </Button>
  </Link>;

  return (
      <AppBar className={appBarClasses}>
        <Toolbar className={classes.container}>
          {leftLinks !== undefined ? brandComponent : null}
          <div className={classes.flex}>
            {leftLinks !== undefined ? (
                <Hidden smDown implementation="css">
                  {leftLinks}
                </Hidden>
            ) : (
                brandComponent
            )}
          </div>
          <Hidden smDown implementation="css">
            {rightLinks}
          </Hidden>
          <Hidden mdUp>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
            >
              <Menu />
            </IconButton>
          </Hidden>
        </Toolbar>
        <Hidden mdUp implementation="js">
          <Drawer
              variant="temporary"
              anchor={"right"}
              open={mobileOpen}
              classes={{
                paper: classes.drawerPaper
              }}
              onClose={handleDrawerToggle}
          >
            <div className={classes.appResponsive}>
              {leftLinks}
              {rightLinks}
            </div>
          </Drawer>
        </Hidden>
      </AppBar>
  );
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};

export default withRouter(Header)