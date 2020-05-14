import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = (props) => {
  return (
    <div>
      <CircularProgress disableShrink />
    </div>
  );
};

export default Loading;