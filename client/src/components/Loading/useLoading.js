import React, { useState } from 'react';
import Loading from "./Loading";

const useLoading = overlay => {
  const [visible, setVisisble] = useState(false);

  const showLoading = () => setVisisble(true);
  const hideLoading = () => setVisisble(false);

  const loading = visible ? <Loading overlay={overlay}/> : null;

  return [loading, showLoading, hideLoading]
};

export default useLoading;