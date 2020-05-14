import React, {useEffect} from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "context/auth";

export default  function PrivateRoute({ component: Component, ...rest }) {
  const {
    authTokens, setAuthTokens,
    accountAddress, setAccountAddress,
    capturedImage, setCapturedImage,
  } = useAuth();

  return (
    <Route
      {...rest}
      render={props =>
        (authTokens === null) ? (
          <Redirect to="/" />

        ) : (
          <Component {...props} />
        )
      }
    />
  );
}
