import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" active>HOME</NavigationItem>
        <NavigationItem link="/">CALLERY</NavigationItem>
        <NavigationItem link="/">ACTIVITY</NavigationItem>
        <NavigationItem link="/">MY COLLECTION</NavigationItem>
        <NavigationItem link="/">CONTACT</NavigationItem>
    </ul>
);

export default navigationItems;