import React from "react";

import Styles from './Layout.module.css'
import Header from "./Header";

const Layout = (props) => (
    <div>
        <Header/>
        <div className={Styles.main}>
            {props.children}
        </div>
    </div>
);

export default Layout;