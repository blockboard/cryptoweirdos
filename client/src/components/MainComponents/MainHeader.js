import React from "react";

// Core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

const dashboardRoutes = ["/"];

export default function MainHeader(props) {
  const { ...rest } = props;

  return (
      <>
        <Header
            color="transparent"
            routes={dashboardRoutes}
            brand="CRYPTOWEIRDOS"
            rightLinks={<HeaderLinks/>}
            fixed
            hideOnScroll={true}
            changeColorOnScroll={{
              height: 100,
              color: "white"
            }}
            {...rest}
        />
      </>
  );
}
