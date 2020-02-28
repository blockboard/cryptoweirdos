import React, { useState, Component } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/bg7.jpg";
import MainHeader from "../../../components/MainComponents/MainHeader";

const useStyles = makeStyles(styles);

/*class LoginPage extends Component {
    state = {
        signupForm: {
            name: {
                value: '',
                valid: false,
                touched: false,
                validators: [required]
            },
            email: {
                value: '',
                valid: false,
                touched: false,
                validators: [required, email]
            },
            password: {
                value: '',
                valid: false,
                touched: false,
                validators: [required, length({ min: 5 })]
            },
            formIsValid: false
        }
    };
}*/


export default function SignUpPage(props) {
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [username, setUsername] = useState("null");
  const [email, setEmail] = useState("null");
  const [password, setPassword] = useState("null");

  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  const classes = useStyles();
  const { ...rest } = props;

  const signupHandler = (event, authData) => {
      // TODO: solve auto detection issue
    console.log(
       `Username: ${username} \n
        Email: ${email} \n
        Password: ${password}`
    );
    event.preventDefault();
    fetch('http://localhost:5000/auth/signin', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
          username: username,
          email: email,
          password: password
      })
    })
        .then(res => {
          if (res.status === 422) {
            throw new Error(
              "Validation failed. Make sure the email address isn't used yet!"
            );
          }
          if (res.status !== 200 && res.status !== 201) {
            console.log('Error!');
            throw new Error('Creating a user failed!');
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
        })
        .catch(err => {
          console.log(err);
        })
  };

  return (
    <div>
      <MainHeader/>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Sign Up</h4>
                    <div className={classes.socialLine}>
                      <Button
                        justIcon
                        href="#pablo"
                        target="_blank"
                        color="transparent"
                        onClick={e => e.preventDefault()}
                      >
                        <i className={"fab fa-twitter"} />
                      </Button>
                      <Button
                        justIcon
                        href="#pablo"
                        target="_blank"
                        color="transparent"
                        onClick={e => e.preventDefault()}
                      >
                        <i className={"fab fa-facebook"} />
                      </Button>
                      <Button
                        justIcon
                        href="#pablo"
                        target="_blank"
                        color="transparent"
                        onClick={e => e.preventDefault()}
                      >
                        <i className={"fab fa-google-plus-g"} />
                      </Button>
                    </div>
                  </CardHeader>
                  <p className={classes.divider}>Or Be Classical</p>
                  <CardBody>
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      callbackFromParent={(username) => {
                          setUsername(username);
                      }}
                    />
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        endAdornment: (
                          <InputAdornment makeStylesposition="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      callbackFromParent={(email) => {
                          setEmail(email);
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off"
                      }}
                      callbackFromParent={(password) => {
                          setPassword(password);
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                        simple
                        color="primary"
                        size="lg"
                        onClick={signupHandler}>
                      Get started
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
