import React from 'react';

import cryptofacesLogo from '../../assets/images/cryptofacesLogo.jpeg'
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={cryptofacesLogo} alt="MyBurger" />
    </div>
);

export default logo;
