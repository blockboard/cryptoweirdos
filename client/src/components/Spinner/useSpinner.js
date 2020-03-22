import React, { useState } from 'react';
import Spinner from "./Spinner";

const useSpinner = overlay => {
  const [visible, setVisisble] = useState(false);

  const showSpinner = () => setVisisble(true);
  const hideSpinner = () => setVisisble(false);

  const spinner = visible ? <Spinner overlay={overlay}/> : null;

  return [spinner, showSpinner, hideSpinner]
};

export default useSpinner;